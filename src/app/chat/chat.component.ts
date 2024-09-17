import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, signal, computed } from '@angular/core';

interface Chat {
  name: string;
  time: string;
}

interface Message {
  text: string;
  time: string;
  imageUrl?: string; 
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  chats: Chat[] = [
    { name: 'Youssef Makhlouf', time: '09:24 PM' },
    { name: 'Tarek Ahmed', time: '09:24 PM' },
  ];

  filteredChats: Chat[] = [...this.chats]; 
  searchText = ''; 

  messages: Message[] = []; 

  selectedChat: Chat | null = this.chats[0]; 
  messageText = ''; 

  
  filterChats() {
    this.filteredChats = this.chats.filter((chat) =>
      chat.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  
  selectChat(chat: Chat) {
    this.selectedChat = chat;
    
  }

  // إرسال الرسائل
  sendMessage() {
    if (this.messageText.trim()) {
      const newMessage: Message = {
        text: this.messageText,
        time: new Date().toLocaleTimeString(),
      };
      this.messages.push(newMessage);
      this.messageText = '';
    }
  }

  // فتح نافذة رفع الملفات
  triggerFileUpload() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // التعامل مع الملف المرفوع
  handleFileInput(event: any) {
    const file: File = event.target.files[0]; // الملف الذي تم رفعه
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        // إضافة الرسالة مع الصورة
        this.messages.push({
          text: '', // لا نحتاج لنص إذا كانت الرسالة عبارة عن صورة
          time: new Date().toLocaleTimeString(),
          imageUrl: reader.result as string, // إضافة الصورة
        });
      };
      reader.readAsDataURL(file); // تحويل الملف إلى base64
    }
  }

  // إضافة خاصية الإرسال عند الضغط على Enter
  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
}
