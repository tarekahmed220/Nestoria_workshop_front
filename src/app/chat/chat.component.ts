
import { ChangeDetectorRef, Component, HostListener, NgZone, OnInit ,OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chat ,Message, Sender } from '../models/IChat';
import { ChatService } from '../services/chat.service';
import { io } from 'socket.io-client';
import { Subject, Subscription, takeUntil } from 'rxjs';



@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})



export class ChatComponent implements OnInit,OnDestroy{
  chats: Chat[] = []
lasestMessage: Message | null = null;
  filteredChats: Chat[] = [...this.chats];
  searchText = '';
  selectedChat:Chat | null = null; // Initially, no chat is selected
  content = '';
  message: string='';
 userId: string = localStorage.getItem('userId')  ||""
messages: Message[] = [];
  modalImage: string | null = null;
  isSidebarVisible: boolean = true; // Controls visibility of the sidebar on mobile
  screenWidth: number;
  onlineUsers: any[] = [];
  private connectedSubscription !: Subscription;
  private onlineUsersSubscription !: Subscription;
private messageSubscription!: Subscription;
private chatsSubscription!: Subscription;
  constructor(private chatService: ChatService, private zone: NgZone ,private cd: ChangeDetectorRef) {
    this.screenWidth = window.innerWidth; // Initialize the screen width
  }
  private destroy$ = new Subject<void>(); 
 
 
  
 


  
  
 
 
  

  // ngOnInit(): void {
  //   this.chatService.initializeSocket();  
  //   this.listenForMessages(); 
    
  //   this.listenForRefreshChats()
  //   this.initializeSocketListeners();
  //   this.getChats();
  // }
  ngOnInit(): void {
  this.socketConnected()
    this.chatService.initializeSocket();  //      socket
    // console.log("Socket connected:", this.chatService.socket.connected); //    
 
  this.setupUser()
  
    //   'onlineUsers'
    this.onlineUsersCount()
  
    this.getChats(); 
    if (this.selectedChat) {
      this.chatService.joinChat(this.selectedChat._id);  //     
    }
    
  this.recieveMessages()
 
   this.refreshChats()
  

    this.chatService.socket.on('connect_error', (error: any) => {
      console.error('Connection Error:', error);
    });
  


}



  socketConnected() {
    this.chatService.listenForConnected().pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      console.log('User is successfully connected to the server');
    });
  }
  setupUser() {
    const userData = {
      _id: this.getCurrentUser()._id, 
      name: ''
    };

    // إرسال بيانات المستخدم عند التحميل
    this.chatService.setupUser(userData);

    // الاستماع لحدث setup
    this.chatService.listenToSetup().pipe(
      takeUntil(this.destroy$)  //      destroy$
    ).subscribe((response) => {
      console.log('Setup response from server:', response);
    });
  }
  onlineUsersCount() {
    this.chatService.listenForOnlineUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe((users) => {
      this.onlineUsers = users;
      console.log('Online users updated:', this.onlineUsers);
    });
  }
  sendSocketMessage() {
    console.log("Preparing to send message:", this.message);
    if (this.selectedChat && this.message.trim()) {
      const messageData = {
        content: this.message,
        chat: this.selectedChat,
        _id: '',  // هنا يمكنك إضافة ID مميز
        sender: this.getCurrentUser(),
        
      
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readBy: [],
        cloudinary_id: '', 
        photo: '',
        id: '',
        __v:0,
      };
      console.log("Socket status:", this.chatService.socket.connected);
         
      
        this.chatService.sendSocketMessage(messageData);
        console.log("Sent message via socket:", messageData);
     

      console.log("msg socket",messageData)
      const newMessage: Message = {
        _id: '',  //
        sender: this.getCurrentUser(),
        content: this.message,
        chat: this.selectedChat,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readBy: [],
        cloudinary_id: '', 
        photo: '',
        id: '',
        __v:0,
      };

      this.zone.run(() => {
        this.messages.push(newMessage);  // تحديث الرسائل في الواجهة
      });

      // this.message = '';  // تفريغ حقل الرسالة بعد الإرسال
    }
     setTimeout(() => this.scrollToBottom(), 0);
  // Call the chat service to send the message as FormData
 
  if ( this.message.trim()) {
    
    const messageData2 :any= {
      content: this.message,
      chatId: this.selectedChat?._id
    };
     this.message = ''; 
  this.chatService.sendMessage(messageData2).subscribe(
    (response) => {
      console.log('Message sent successfully:', response);
      // Add the new message to the messages array (optional: depends on your API response)
      //  this.messages.push(response);
      // Clear the input field after sending the message
      this.content = '';
      // Scroll to the bottom after sending the message
      setTimeout(() => this.scrollToBottom(), 0);
    },
    (error) => {
      console.error('Error sending message:', error);
    }
  );
  
}
  }

 recieveMessages() {
  console.log("Listening for incoming messages...");
  this.chatService.getSocketMessages().pipe(
    takeUntil(this.destroy$)
  ).subscribe((messageData) => {
    if (this.selectedChat && messageData.chat._id === this.selectedChat._id) {
      this.addMessageToChat(messageData);
    }
  });
 }
 refreshChats() {
   // this.listenForRefreshChats()
 
   console.log("Subscribing to refresh chats...");
   this.chatService.refreshChats().pipe(
     takeUntil(this.destroy$)
   ).subscribe((updatedChats) => {
    //  this.zone.run(() => {
      this.cd.detectChanges();
       this.chats = updatedChats;
    //  });
     
   });
 }
  //   listenForMessages() {
  //     this.chatService.getSocketMessages().subscribe((messageData: {content: string; chat: Chat}) => {
  //       console.log("Message received:", messageData);
  //       if (this.selectedChat && messageData.chat._id === this.selectedChat._id) {
  //         this.addMessageToChat(messageData);  // إضافة الرسالة إلى المحادثة
  //       }
      
  //     });
     
  // }
  addMessageToChat(messageData: {content: string; chat: Chat}) {
    const newMessage: Message = {
      _id: '',  // استخدام المعرف الوارد من الخادم
      sender: this.getCurrentUser(),
      content: messageData.content,
      chat: messageData.chat,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readBy: [],
      cloudinary_id: '',
      photo: '',
      __v: 0,
      id: ''
    };
  
    this.zone.run(() => {
      this.messages.push(newMessage);  // تحديث الرسائل الواردة من الـ socket
    });
    setTimeout(() => this.scrollToBottom(), 0);
    
  }
  ngOnDestroy(): void {
    console.log("ngOnDestroy called, subscription should be canceled.");
   this.destroy$.next();
   this.destroy$.complete();

    // this.chatService.disconnectListeners();
  }
  listenForRefreshChats() {
    this.chatService.socket.on("refresh chats", (updatedChats: Chat[]) => {
        console.log("Received updated chat:", updatedChats);
        this.zone.run(() => {
          
            this.chats = updatedChats;
        });
    });
}
  
  
  // دالة جلب المحادثات
  getChats() {
    this.chatService.getChat().subscribe((chats: Chat[]) => {
      this.chats = chats;
      console.log(this.chats);
      if(!this.selectedChat && this.chats.length >0){
        this.selectedChat=this.chats[0]
      
        this.chatService.joinChat(this.selectedChat._id)
      }
    });
  }
  // updatedChats:Chat[]=[]
  // listenForRefreshChats() {
    
  //   this.chatService.socket.on("refresh chats", (updatedChats:any) => {
      
  //     console.log("Received updated chats:", updatedChats);
  //     this.chatService.getChat().subscribe((chats:Chat[])=>{
  //        this.updatedChats=chats
  //       console.log(chats)
  //     })
  //     this.chats = this.updatedChats; // تحديث قائمة المحادثات
  //   });
  // }
  // دالة لجلب المستخدم الحالي
  getCurrentUser(): Sender {
    return {
      _id: localStorage.getItem('userId') || '',
      fullName: 'User',
      email: 'user@example.com',
      id: localStorage.getItem('userId') || ''
    };
  }

  // Listen to window resize events to update the screen width
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;
  }

  // Method to check if the screen size is mobile (below 768px)
  isMobile(): boolean {
    return this.screenWidth < 768;
  }

  // Toggle sidebar visibility on small screens
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  filterChats() {
    this.filteredChats = this.chats.filter((chat) =>{}
      // chat.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectChat(chat: Chat) {
     this.selectedChat = chat;
     if(this.selectedChat){
     this.chatService.joinChat(this.selectedChat._id);}
     this.chatService.getSelectedChat(this.selectedChat._id).subscribe((data: Message[]) => {
      this.messages = []; // Clear previous messages
      
      data.forEach((message: Message) => {
        if (message.content) {
          this.messages.push(message);
        }
        if (message.photo) {
          this.messages.push(message);
        }
      });

      setTimeout(() => this.scrollToBottom(), 0);
    });
  
    if (this.isMobile()) {
      this.isSidebarVisible = false; // Auto-hide the sidebar on mobile when a chat is selected
    }

  }

 
  // sendMessage() {
  //   if (this.content.trim() && this.selectedChat) {
  //     // Create FormData object and append the message content and chat ID
  //     const messageData = {
  //       content: this.content,
  //       chatId: this.selectedChat._id
  //     };
  //     // Call the chat service to send the message as FormData

  //     this.chatService.sendMessage(messageData).subscribe(
  //       (response) => {
  //         console.log('Message sent successfully:', response);
  //         // Add the new message to the messages array (optional: depends on your API response)
  //         //  this.messages.push(response);
  //         // Clear the input field after sending the message
  //         this.content = '';
  //         // Scroll to the bottom after sending the message
  //         setTimeout(() => this.scrollToBottom(), 0);
  //       },
  //       (error) => {
  //         console.error('Error sending message:', error);
  //       }
  //     );
  //   }
  // }
  
  scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  triggerFileUpload() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    
    if (file && this.selectedChat) {
      const formData = new FormData();
      formData.append('photo', file);  // Append the file
      formData.append('chatId', this.selectedChat._id);  // Append the chat ID
  
      this.chatService.sendPhoto(formData).subscribe(
        (response) => {
          console.log('Photo sent successfully:', response);
          this.messages.push(response);  // Optionally update the UI with the new message
          setTimeout(() => this.scrollToBottom(), 0);
        },
        (error) => {
          console.log('Error sending photo:', error.error.message);
          alert(error.error.message);
        }
      );
    }
    else {
      console.error('No file selected or no chat selected');
    }
  }
  
  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendSocketMessage();
    }
  }

  openImageModal(photo: string) {
    this.modalImage = photo;
  }

  closeImageModal() {
    this.modalImage = null;
  }
}
