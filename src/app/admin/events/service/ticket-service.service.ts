import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TicketEvenement } from '../models/ticket-evenement.model';
import { Observable, switchMap } from 'rxjs';
import { QrCodeService } from './qr-code.service';

@Injectable({
  providedIn: 'root'
})
export class TicketServiceService {

  private apiUrl = 'http://localhost:8090/ecoCycleTech/tickets';
  constructor(private http: HttpClient,private qrCodeService: QrCodeService) { }

  // Create a new ticket
  createTicket(ticket: TicketEvenement): Observable<TicketEvenement> {
    return this.http.post<TicketEvenement>(this.apiUrl, ticket);
  }

  // Get ticket by ID
  getTicketById(id: number): Observable<TicketEvenement> {
    return this.http.get<TicketEvenement>(`${this.apiUrl}/${id}`);
  }

  // Get all tickets
  getAllTickets(): Observable<TicketEvenement[]> {
    return this.http.get<TicketEvenement[]>(this.apiUrl);
  }

  // Update a ticket
  updateTicket(id: number, ticket: TicketEvenement): Observable<TicketEvenement> {
    return this.http.put<TicketEvenement>(`${this.apiUrl}/${id}`, ticket);
  }

  // Delete a ticket
  deleteTicket(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
  // GetTicket by User id 
  getTicketByUserId(id: number): Observable<TicketEvenement[]> {
    return this.http.get<TicketEvenement[]>(`${this.apiUrl}/usertickets/${id}`);
  }

  // Additional helper method to create ticket for specific event and user
  createTicketForEvent(ticketData: any): Observable<TicketEvenement> {
    return this.createTicket(ticketData as unknown as TicketEvenement);
  }
  
  createTicketWithQR(ticket: TicketEvenement): Observable<TicketEvenement> {
    const qrData = this.generateQRData(ticket);
    
    return this.qrCodeService.generateQRCode(qrData).pipe(
      switchMap(qrUrl => {
        ticket.qrCodeUrl = qrUrl; // Add QR code URL to ticket
        return this.createTicket(ticket);
      })
    );
  }

  private generateQRData(ticket: TicketEvenement): string {
    return JSON.stringify({
      ticketId: ticket.idTicketEvenement,
      eventId: ticket.evenement.idEvenement,
      userId: ticket.user?.idUser,
      purchaseDate: ticket.dateAchat.toISOString()
    });
  }
}

