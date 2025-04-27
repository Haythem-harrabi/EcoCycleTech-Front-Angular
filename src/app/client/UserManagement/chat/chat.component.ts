import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService, ChatResponse } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  userInput: string = '';
  messages: { role: string, content: string }[] = [];
  isChatOpen: boolean = false;
  isLoading: boolean = false;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor(private chatService: ChatService) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ role: 'user', content: this.userInput });
    this.isLoading = true;

    this.chatService.sendMessage(this.userInput).subscribe(
      (response: ChatResponse) => {
        this.messages.push({ role: 'assistant', content: response.response });
        this.userInput = '';
        this.isLoading = false;
      },
      (error) => {
        console.error('Error sending message:', error);
        this.messages.push({ role: 'assistant', content: 'Error: Could not get a response from the server.' });
        this.isLoading = false;
      }
    );
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }
}