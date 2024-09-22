
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chat ,Message } from '../models/IChat';
import { ChatService } from '../services/chat.service';



@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  chats: Chat[] = []
lasestMessage: Message | null = null;
  filteredChats: Chat[] = [...this.chats];
  searchText = '';
  selectedChat:Chat | null = null; // Initially, no chat is selected
  content = '';
// userId: string | null = '';
messages: Message[] = [];
  modalImage: string | null = null;
  isSidebarVisible: boolean = true; // Controls visibility of the sidebar on mobile
  screenWidth: number;
userId=localStorage.getItem('userId')
  constructor(private chatService: ChatService) {
    this.screenWidth = window.innerWidth; // Initialize the screen width
  }
  ngOnInit(): void {
    
    this.getChats()
    // this.selectChat()
  
    
  }
  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
  
    if (token) {
      // JWT format is: header.payload.signature
      const tokenParts = token.split('.');
  
      if (tokenParts.length === 3) {
        // Decode the payload part (second part of the token)
        const base64Url = tokenParts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((char) => {
          return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
  
        // Parse the JSON payload to retrieve the userId
        const payload = JSON.parse(jsonPayload);
        console.log(payload.userId || payload.sub)
        // Return the userId from the payload (assumed to be stored under 'userId' or 'sub')
        return payload.userId || payload.sub;

      }
    }
  
    return null;
  }
  // getUserIdFromToken();
  // localStorage.setItem('userId', this.userId);
  setUserId(userId: string) {
    this.getUserIdFromToken()
    this.userId=this.getUserIdFromToken()||'';
  
  console.log(this.userId)
  localStorage.setItem('userId', this.userId)
  }
  
  getChats() {
    // const userId=JSON.stringify(localStorage.getItem('userId'))
    // console.log(userId,'userId')
    this.chatService.setUserId()
    this.chatService.getChat().subscribe((chat) => {
      
      this.chats = chat
      console.log(this.chats)
      this.filteredChats = [...this.chats];

      },(error)=>console.log('Error fetching chats:'));
      
  
      this.filteredChats = [...this.chats];
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
          console.log('Error sending photo:', error);
        }
      );
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
