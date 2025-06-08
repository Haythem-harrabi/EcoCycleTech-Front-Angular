import { Component, OnInit } from '@angular/core';
import { TicketEvenement } from '../../../models/ticket-evenement.model';
import { TicketServiceService } from '../../../service/ticket-service.service';
import { Router } from '@angular/router'; // Add this import
import { User } from 'src/app/admin/models/user';
import { AuthService } from 'src/app/client/UserManagement/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { PaiementService } from 'src/app/admin/GestionAppareils/services/paiement.service';

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
  private destroy$ = new Subject<void>();

  // Search functionality
  searchTerm = '';
  searchType: 'eventName' | 'userId' | 'userName' | 'eventdate' | 'purchaseDate' = 'eventName'; // 3 options
  userRole: string  = 'ADMIN';
  //const currentUser = this.authService.getCurrentUser();
  currentUser: any;
  isAdmin !: boolean;
  isClient !: boolean;

  constructor(private ticketService: TicketServiceService, private router: Router,private authService:AuthService) { }


  // get isAdmin(): boolean {
  //   return this.userRole === 'ADMIN';
  // }

  // get isClient(): boolean {
  //   return this.userRole === 'CLIENT';
  // }
  loadTicketsByUserId(): void {
    if (!this.currentUser) {
      this.error = 'No user logged in';
      this.loading = false;
      return;
    }
    this.loading = true;
    this.ticketService.getTicketByUserId(this.currentUser.id).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filteredTickets = [...tickets];
        this.loading = false;
        console.log("Filtered Tickets from getAllTickets = "+this.filteredTickets)
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

        tickets.forEach(ticket =>  console.log("ticket" + ticket.user?.idUser))


        this.filteredTickets = [...tickets];
        this.loading = false;
        console.log("Filtered Tickets from getAllTickets = "+JSON.stringify(this.tickets))
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
    this.filteredTickets = [...this.tickets];
    return;
  }

  const term = this.searchTerm.toLowerCase().trim();
  this.filteredTickets = this.tickets.filter(ticket => {
    switch (this.searchType) {
      case 'eventName':
        return ticket.evenement?.nomEvenement?.toLowerCase().includes(term);
      case 'userId':
        return ticket.user?.id?.toString().includes(term);
      case 'userName':
        return ticket.user?.username?.toLowerCase().includes(term);
      case 'eventdate':
        return ticket.evenement?.dateEvenement &&
               new Date(ticket.evenement.dateEvenement).toISOString().split('T')[0].includes(term);
      case 'purchaseDate':
        return new Date(ticket.dateAchat).toISOString().split('T')[0].includes(term);
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

  ngOnInit(): void {
    this.currentUser= this.authService.getCurrentUser();
    console.log("current user : "+JSON.stringify(this.currentUser, null, 2))
    if (this.currentUser.role=="ADMIN"){
      this.isAdmin=true;
      this.isClient = false
    }
    else{
      this.isAdmin=false
      this.isClient = true
    }
    console.log('isAdmin = '+ this.isAdmin)
    const currentUrl = this.router.url;
   // const currentUser = this.authService.getCurrentUser();
 this.authService.currentUser$.pipe(
      takeUntil(this.destroy$) // Recommended to prevent memory leaks
    ).subscribe(currentUser => {
      if (currentUser && currentUser.id) {
        // User is logged in - fetch their reservations
        this.ticketService.getTicketByUserId(currentUser.id).subscribe({
          next: (data) => {
            this.filteredTickets = data;
            console.log("Filtered Tickets from getAllTickets = "+JSON.stringify(this.filteredTickets))
          },
          error: (err) => {
            console.error('Error fetching user reservations:', err);
            alert('Failed to load your reservations. Please try again later.');
          }
        });
      } else {
        // User is not logged in - fetch all reservations or handle accordingly
        this.ticketService.getAllTickets().subscribe({
          next: (data) => {
            this.filteredTickets = data;
            console.log("Filtered Tickets from getAllTickets = "+this.filteredTickets)
          },
          error: (err) => {
            console.error('Error fetching reservations:', err);
            alert('Failed to load reservations. Please try again later.');
          }
        });
      }
    });

   // currentUser.userRole = currentUrl.startsWith('/admin') ? 'ADMIN' : 'CLIENT';
    if (this.isAdmin) {
      this.loadTickets();
      // console.log("Tickets = "+this.tickets)


    }
    else {
      this.loadTicketsByUserId();
      // console.log(this.tickets)

    }
  }
 
}
