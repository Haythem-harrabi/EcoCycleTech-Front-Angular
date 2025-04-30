import { Component, OnInit } from '@angular/core';
import { TicketEvenement } from '../../../models/ticket-evenement.model';
import { TicketServiceService } from '../../../service/ticket-service.service';
import { Router } from '@angular/router'; // Add this import

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: TicketEvenement[] = [];
  filteredTickets: TicketEvenement[] = [];
  loading = false;
  error: string | null = null;
  
  // Search functionality
  searchTerm = '';
  searchType: 'eventName' | 'userId' | 'userName' | 'eventdate' | 'purchaseDate' = 'eventName'; // 3 options
  userRole: number = 1;
  currentUserId = 1; // Hardcoded for testing (replace later)
  constructor(private ticketService: TicketServiceService, private router: Router) { }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    this.userRole = currentUrl.startsWith('/admin') ? 0 : 1;
    if (this.isAdmin) {
      this.loadTickets();
    }
    else {
      this.loadTicketsByUserId();
    }
  }
  get isAdmin(): boolean {
    return this.userRole === 0;
  }

  get isClient(): boolean {
    return this.userRole === 1;
  }
  loadTicketsByUserId(): void {
      this.loading = true;
      this.ticketService.getTicketByUserId(this.currentUserId).subscribe({
        next: (tickets) => {
          this.tickets = tickets;
          this.filteredTickets = [...tickets];
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load tickets';
          this.loading = false;
        }
      });
    }
  

  loadTickets(): void {
    this.loading = true;
    this.error = null;
    this.ticketService.getAllTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filteredTickets = [...tickets];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tickets';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteTicket(id: number): void {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(id).subscribe({
        next: () => {
          this.tickets = this.tickets.filter(t => t.idTicketEvenement !== id);
        },
        error: (err) => {
          console.error('Error deleting ticket:', err);
          this.error = 'Failed to delete ticket';
        }
      });
    }
  }
  // Filter tickets based on search
  searchTickets(): void {
    if (!this.searchTerm.trim()) {
      this.loadTickets();
      
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredTickets = this.tickets.filter(ticket => {
      switch (this.searchType) {
        case 'eventName':
          return ticket.evenement?.nomEvenement?.toLowerCase().includes(term);
        case 'userId':
          return ticket.user?.idUser?.toString().includes(term);
        case 'userName':
          return ticket.user?.nom?.toLowerCase().includes(term);
        case 'eventdate':
          const eventDate = new Date(ticket.evenement?.dateEvenement).toISOString().split('T')[0];
          return eventDate.includes(term);
        case 'purchaseDate':
          const purchaseDate = new Date(ticket.dateAchat).toISOString().split('T')[0];
          return purchaseDate.includes(term);
        default:
          return true;
      }
    });
  }
  onSearchTypeChange(): void {
    this.searchTerm = ''; // Clear the search term
    this.loadTickets();
  }
  // Add this new method
  navigateToNewTicket(): void {
    this.router.navigate(['/admin/newticket']);
  }
}