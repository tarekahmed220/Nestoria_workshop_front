
import { ChangeDetectorRef, Component, HostListener, NgZone, OnInit ,OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chat ,Message, Sender } from '../models/IChat';
import { ChatService } from '../services/chat.service';
import { io } from 'socket.io-client';



@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})

// socket.on('reconnect', () => {
//   console.log('Reconnected to socket');
// });

export class ChatComponent implements OnInit{
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
socketMsg:any;

  constructor(private chatService: ChatService, private zone: NgZone) {
    this.screenWidth = window.innerWidth; // Initialize the screen width
  }
  // generateUniqueId(): string {
  //   return Math.random().toString(36).substr(2, 9); // Simple unique ID generator
  // }
  // getCurrentUser(): Sender {
  //   // Replace this with your actual logic to get the current user (probably from authentication service)
  //   return {
  //     _id: this.userId,
  //     fullName: '',
  //     email: '',
  //     id:this.userId
  //   };
  // }
  // ngOnInit(): void {
    
  //   this.getChats()
  
    
  // }
 
  
 

  // sendSocketMessage() {
  //   if(this.selectedChat && this.message.trim()) {
  //     const messageData = {
  //       content: this.message,
  //       chat: this.selectedChat
  //     }
  //   this.socketMsg=this.chatService.sendSocketMessage(messageData);
  //   this.messages.push(this.socketMsg)
  //   // this.socketMsg = '';
  //   }
  // }
  
  
 
 
  
 /* getChats() {
    this.chatService.setUserId()
    this.chatService.getChat().subscribe((chat:Chat[]) => {
      this.chats = chat
      console.log(this.chats)
      this.filteredChats = [...this.chats];

      },(error)=>console.log('Error fetching chats:'));
      this.filteredChats = [...this.chats];

   
    if(this.selectedChat){
    this.chatService.joinChat(this.selectedChat?._id)
    this.chatService.getSocketMessages().subscribe((messageData: { content: string; chat: Chat }) => {
      console.log('Received message from socket:', messageData);
      if (this.selectedChat && messageData.chat._id === this.selectedChat._id) {
        const newMessage: Message = {
          _id: '', 
          sender: this.getCurrentUser(),
          photo: '', 
          content: messageData.content, 
          chat: this.selectedChat, 
          readBy: [], 
          cloudinary_id: '', 
          createdAt: '', 
          updatedAt: '', 
          __v: 0, 
          id: '' 
        };
  
        this.zone.run(() => {
          this.messages.push(newMessage);
        });
  
        setTimeout(() => this.scrollToBottom(), 0);
      }
    });
  }}
  */
  ngOnInit(): void {
    this.chatService.initializeSocket();  // تأكد من تهيئة الاتصال بالـ socket
    this.listenForMessages(); 
    
    this.listenForRefreshChats()
    this.getChats();
  }

  // دالة إرسال الرسالة
  sendSocketMessage() {
    console.log("Preparing to send message:", this.message);
    if (this.selectedChat && this.message.trim()) {
      const messageData = {
        content: this.message,
        chat: this.selectedChat
      };
      console.log("Socket status:", this.chatService.socket.connected);
      this.chatService.joinChat(this.selectedChat?._id);  // تأكد أن المستخدم ينضم للغرفة عند التهيئة
      setTimeout(() => {
        this.chatService.sendSocketMessage(messageData);
        console.log("Sent message via socket:", messageData);
      }, 500); // إعطاء بعض الوقت للانضمام للغرفة
      // إرسال الرسالة عبر socket
      // this.chatService.sendSocketMessage(messageData);
      console.log("msg socket",messageData)
      // إضافة الرسالة إلى القائمة بعد الإرسال
      const newMessage: Message = {
        _id: '',  // هنا يمكنك إضافة ID مميز
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
  );}
  }

  // الاستماع إلى الرسائل من الـ socket
  listenForMessages() {
    this.chatService.getSocketMessages().subscribe((messageData: {content: string; chat: Chat}) => {
      console.log("msg",messageData)
      if (this.selectedChat && messageData.chat._id === this.selectedChat._id) {
        const newMessage: Message = {
          _id: '',
          sender: this.getCurrentUser(),
          content: messageData.content,
          chat: this.selectedChat,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          readBy: [],
          cloudinary_id: '',
          photo:'',
          __v:0,
          id: ''
        };

        this.zone.run(() => {
          this.messages.push(newMessage);  // تحديث الرسائل الواردة من الـ socket
        });
      }
    });
  }

  // دالة جلب المحادثات
  getChats() {
    this.chatService.getChat().subscribe((chats: Chat[]) => {
      this.chats = chats;
      console.log(this.chats);
      if(!this.selectedChat && this.chats.length >0){
        this.selectedChat=this.chats[0]
      }
      if(this.selectedChat){
        this.chatService.joinChat(this.selectedChat._id)
      }
    });
  }
  updatedChats:Chat[]=[]
  listenForRefreshChats() {
    
    this.chatService.socket.on("refresh chats", (updatedChats:any) => {
      
      console.log("Received updated chats:", updatedChats);
      this.chatService.getChat().subscribe((chats:Chat[])=>{
         this.updatedChats=chats
        console.log(chats)
      })
      this.chats = this.updatedChats; // تحديث قائمة المحادثات
    });
  }
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

 
  sendMessage() {
    if (this.content.trim() && this.selectedChat) {
      // Create FormData object and append the message content and chat ID
      const messageData = {
        content: this.content,
        chatId: this.selectedChat._id
      };
      // Call the chat service to send the message as FormData

      this.chatService.sendMessage(messageData).subscribe(
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
      this.sendMessage();
    }
  }

  openImageModal(photo: string) {
    this.modalImage = photo;
  }

  closeImageModal() {
    this.modalImage = null;
  }
}
