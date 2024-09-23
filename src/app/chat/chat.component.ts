
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
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
 userId: string = JSON.stringify(localStorage.getItem('userId') ) ||""
messages: Message[] = [];
  modalImage: string | null = null;
  isSidebarVisible: boolean = true; // Controls visibility of the sidebar on mobile
  screenWidth: number;

  constructor(private chatService: ChatService, private cd:ChangeDetectorRef) {
    this.screenWidth = window.innerWidth; // Initialize the screen width
  }
  generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9); // Simple unique ID generator
  }
  getCurrentUser(): Sender {
    // Replace this with your actual logic to get the current user (probably from authentication service)
    return {
      _id: this.userId,
      fullName: '',
      email: '',
      id:this.userId
    };
  }
  ngOnInit(): void {
    
    this.getChats()
   
    
    
    
    
    
  }
 
  
 
  sendSocketMessage() {
    this.chatService.sendSocketMessage(this.message);
    this.message = '';
    
  }
  
  
 
 
  
  getChats() {
  const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  withCredentials: true
});
socket.on('connect', () => {
  console.log('Connected to the server');
});
    this.chatService.setUserId()
    this.chatService.getChat().subscribe((chat) => {
      
      this.chats = chat
      console.log(this.chats)
      this.filteredChats = [...this.chats];

      },(error)=>console.log('Error fetching chats:'));
      this.filteredChats = [...this.chats];
      this.chatService.getSocketMessages().subscribe((messageData: { content: string; chatId: string }) => {
        if (this.selectedChat && messageData.chatId === this.selectedChat._id) {
          const newMessage: Message = {
            _id: '',  // Generate a unique ID for the message
            sender: this.getCurrentUser(), // Replace with your method to get the current user
            photo: '',                     // Placeholder for photo, if there's no photo for the message
            content: messageData.content,  // Message content
            chat: this.selectedChat,       // Use the selected chat
            readBy: [],                    // Initialize as an empty array (you can modify this as needed)
            cloudinary_id: '',             // Placeholder for cloudinary ID, if applicable
            createdAt: new Date().toISOString(),  // Timestamp for when the message was created
            updatedAt: new Date().toISOString(),  // Timestamp for when the message was updated
            __v: 0,                        // Default value for versioning
            id: ''     // Another unique ID
          };
    
          this.messages.push(newMessage);
          
          this.cd.detectChanges()
          setTimeout(() => this.scrollToBottom(), 0);
        }
      });
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
      this.chatService.sendSocketMessage(messageData.content);
      // Call the chat service to send the message as FormData

      this.chatService.sendMessage(messageData).subscribe(
        (response) => {
          console.log('Message sent successfully:', response);
          // Add the new message to the messages array (optional: depends on your API response)
           this.messages.push(response);
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
