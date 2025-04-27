import { Component } from '@angular/core';
import { ChatService, ChatResponse } from '../services/chat.service'; // Import ChatResponse

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userInput: string = '';
  messages: { role: string, content: string }[] = [];
  isChatOpen: boolean = false;

  constructor(private chatService: ChatService) { }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ role: 'user', content: this.userInput });

    this.chatService.sendMessage(this.userInput).subscribe(
      (response: ChatResponse) => {
        this.messages.push({ role: 'assistant', content: response.response }); // Access response.response
        this.userInput = '';
      },
      (error) => {
        console.error('Error sending message:', error);
        this.messages.push({ role: 'assistant', content: 'Error: Could not get a response from the server.' });
      }
    );
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }
}