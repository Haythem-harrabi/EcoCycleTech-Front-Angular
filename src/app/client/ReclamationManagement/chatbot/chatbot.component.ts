import { ChatRequest } from 'src/app/admin/models/chat-request.model';
import { ChatResponse } from '../../UserManagement/services/chat.service';
import { ChatbotService } from 'src/app/services/chatbot.service';
import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  chatWindow: Window | null = null;
  @ViewChild('chatBox') private chatBox!: ElementRef;
  userMessage = '';
  messages: string[] = [];  // Utilisation d'un tableau de chaînes de caractères
  isLoading = false;
  errorMessage = '';

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.addBotMessage('Hello! How can I assist you today ?');
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    const userMessage = this.userMessage;
    this.addUserMessage(userMessage);
    this.userMessage = '';
    this.isLoading = true;

    
    this.chatbotService.sendMessage(userMessage).subscribe({
      next: (response: ChatResponse) => {  
        if (response.error) {
          this.addBotMessage("Une erreur est survenue : " + response.response);
        } else {
          this.addBotMessage(response.response);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.addBotMessage('Désolé, service temporairement indisponible');
        this.errorMessage = 'Erreur de connexion au serveur';
        this.isLoading = false;
      }
    });
  }

  private addUserMessage(text: string): void {
    this.messages.push("👤 You: " + text);  
  }

  private addBotMessage(text: string): void {
    this.messages.push("🤖 Assistant: " + text);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch(err) { }
  }

  
  showChat = false; // Add this at the top inside your component

toggleChat() {
  this.showChat = !this.showChat;
}

  
}