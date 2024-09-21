
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Chat {
  name: string;
  time: string;
  messages: Message[];
}

interface Message {
  text: string;
  time: string;
  imageUrl?: string;
  sender: 'me' | 'other';
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  chats: Chat[] = [
    { name: 'Ahmed Joba 🦅', time: '09:24 PM', messages: [] },
    { name: 'Ahmed Tarek ♥️👬', time: '09:24 PM', messages: [] },
    { name: 'Youssef Makhlouf 💪👬', time: '09:24 PM', messages: [] },
    { name: 'Tarek Ahmed  ♥️', time: '09:24 PM', messages: [] },
    { name: 'nour', time: '09:24 PM', messages: [] },
    { name: 'abdo', time: '09:24 PM', messages: [] },
    { name: 'hend', time: '09:24 PM', messages: [] },
  ];

  filteredChats: Chat[] = [...this.chats];
  searchText = '';
  selectedChat: Chat | null = null; // Initially, no chat is selected
  messageText = '';

  modalImage: string | null = null;
  isSidebarVisible: boolean = true; // Controls visibility of the sidebar on mobile
  screenWidth: number;

  constructor() {
    this.screenWidth = window.innerWidth; // Initialize the screen width
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
    this.filteredChats = this.chats.filter((chat) =>
      chat.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectChat(chat: Chat) {
    this.selectedChat = chat;
    if (this.isMobile()) {
      this.isSidebarVisible = false; // Auto-hide the sidebar on mobile when a chat is selected
    }
  }

  sendMessage() {
    if (this.messageText.trim() && this.selectedChat) {
      const newMessage: Message = {
        text: this.messageText,
        time: new Date().toLocaleTimeString(),
        sender: 'me',
      };
      this.selectedChat.messages.push(newMessage);
      this.selectedChat.time = newMessage.time;
      this.messageText = '';
      setTimeout(() => this.scrollToBottom(), 0);
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
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.selectedChat) {
          this.selectedChat.messages.push({
            text: '',
            time: new Date().toLocaleTimeString(),
            imageUrl: reader.result as string,
            sender: 'me',
          });
          this.selectedChat.time = new Date().toLocaleTimeString();
          setTimeout(() => this.scrollToBottom(), 0);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  openImageModal(imageUrl: string) {
    this.modalImage = imageUrl;
  }

  closeImageModal() {
    this.modalImage = null;
  }
}
