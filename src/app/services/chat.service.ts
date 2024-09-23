import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat, Message } from '../models/IChat';
import {io} from 'socket.io-client';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private apiUrl = 'http://localhost:5000/api/v1/fur/chat';
  private messageUrl = 'http://localhost:5000/api/v1/fur/message';
  // public userId: string | null = '';
  constructor(private http: HttpClient) { }
  public socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
    withCredentials: true
  });
  // this.socket.on('connect', () => {
  //   console.log('Connected to the server');
  // });
  
  sendSocketMessage(message: string){
    this.socket.emit('new message', message);
  }

  getSocketMessages() : Observable<{content:string, chatId:string}> {
    return new Observable (observer => {
      this.socket.on('message received', (messageData:{content:string, chatId:string}) => {
        observer.next(messageData);
      });
      return () => { this.socket.disconnect(); };  
    });
    
  }

  getChat(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
  getSelectedChat(_id: string): Observable<[Message]> {
    return this.http.get<[Message]>(`${this.messageUrl}/${_id}`);
  }
  sendMessage(messageData: { content: string; chatId: string }): Observable<any> {
    const headers = { 'Content-Type': 'application/json' }; // Explicitly set the Content-Type
  return this.http.post(`${this.messageUrl}`, messageData, { headers });
  }
  sendPhoto(messageData: FormData): Observable<any> {
  return this.http.post(`${this.messageUrl}/photo`, messageData, );
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
       
        // Return the userId from the payload (assumed to be stored under 'userId' or 'sub')
        return payload.id || payload.sub;
      }
    }
  
    return null;
  }
  

  setUserId() {
    const userId : string = this.getUserIdFromToken() ||"";
  
  localStorage.setItem('userId', userId);
  }
  

  
}
