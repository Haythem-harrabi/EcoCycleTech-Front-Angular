import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequest } from '../admin/models/chat-request.model';
import { ChatResponse } from '../admin/models/chat-response.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private chatbotApiUrl = 'http://localhost:8082/ecoCycleTech/api/chatbot';  

  constructor(private http: HttpClient) { }

  
  sendMessage(message: string): Observable<ChatResponse> {
    const request: ChatRequest = { message: message };  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<ChatResponse>(this.chatbotApiUrl, request, { headers });
  }
  
}
