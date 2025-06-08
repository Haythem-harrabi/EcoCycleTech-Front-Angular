import { Component, OnInit } from '@angular/core';
import { Evenement } from '../../models/evenement.model';
import { EvenementService } from '../../service/event-service.service';
import { WeatherService } from '../../service/weather-service.service';
import { Router } from '@angular/router';
import { TicketServiceService } from '../../service/ticket-service.service';
import { D17PaymentService } from '../../service/d17-payment.service';
import { lastValueFrom } from 'rxjs';
import { TicketEvenement } from '../../models/ticket-evenement.model';
import { environment } from '../../models/environment';
import { AuthService } from 'src/app/client/UserManagement/services/auth.service';
@Component({
  selector: 'app-evenement-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
    evenements: Evenement[] = [];
    currentEventIndex = 0;
    loading = false;
    error = '';
    currentView = 'Upcoming Events';
    isTransitioning = false;
    allEventsMode: 'oldest' | 'newest' = 'oldest';
    showAllEvents = false;
    sortOptions = [
      { label: 'Oldest First', value: 'oldest' },
      { label: 'Newest First', value: 'newest' }
    ];
    selectedSort = 'oldest'; // Default selection
    shouldBlink = true;
    originalEvents: Evenement[] = [];
    filteredEvents: Evenement[] = [];
    searchQuery: string = '';
    private blinkInterval: any;  
    eventDetailsVisibility: { [key: number]: boolean } = {};
    weatherData: {[key: number]: {icon: string; temp: string}} = {};
    userRole: number = 1;
    isProcessing = false;
    constructor(private evenementService: EvenementService, private weatherService: WeatherService, private router: Router,private paymentService: D17PaymentService,  
      private ticketService: TicketServiceService, private authService: AuthService) { }
  
    ngOnInit(): void {
      const currentUrl = this.router.url;
      this.userRole = currentUrl.startsWith('/admin') ? 0 : 1;
      this.currentView = this.isAdmin ? 'All Events' : 'Upcoming Events';
      if (this.isAdmin) {
        this.selectedSort = 'newest'; // Force newest first for admin
        this.loadRecentEvents(); // This will show all events immediately
      }
      else {
        this.loadUpcomingEvents();
      }
      this.startBlinking();
    }
        get isAdmin(): boolean {
          return this.userRole === 0;
        }
      
        get isClient(): boolean {
          return this.userRole === 1;
        }
    ngOnDestroy(): void {
      // Clean up interval when component is destroyed
      if (this.blinkInterval) {
        clearInterval(this.blinkInterval);
      }
    }
    startBlinking(): void {
      this.blinkInterval = setInterval(() => {
        this.shouldBlink = !this.shouldBlink;
      }, 5000); // Toggle every 5 seconds
    }
    isDeadlineUrgent(event: any): boolean {
      const deadline = this.getDeadline(event.dateEvenement);
      const remaining = this.getTimeRemaining(deadline);
      return remaining.hours < 24 && remaining.days === 0;
    }
        
    loadUpcomingEvents(): void {
      this.loading = true;
      this.error = '';
      this.evenementService.getEvenementsUpcoming().subscribe({
        next: (data) => {
          this.evenements = data;
          this.fetchWeatherForEvents();
          this.loading = false;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.error = 'Failed to load upcoming events. Please try again later.';
          this.loading = false;
          // Optionally load mock data for development
          if (!environment.production) {
            this.loadMockUpcomingEvents();
          }
        }
      });
    }
    private loadMockUpcomingEvents() {
      this.evenements = [{
        idEvenement: 1,
        nomEvenement: 'Sample Event',
        dateEvenement: new Date(Date.now() + 86400000), // Date object
        prixEvenement: 50,
        provenanceEvenement: 'Paris, France',
        localisationEvenement: 'Grand Palais',
        nbrPlacesEvenement: 100,
        aftermovie: 'https://example.com/aftermovie.mp4'
      } as Evenement]; // Type assertion to ensure compliance
      this.fetchWeatherForEvents();
    }
    fetchWeatherForEvents() {
      this.evenements.forEach(event => {
        // Only fetch for upcoming events (within 5 days)
        const eventDate = new Date(event.dateEvenement);
        const today = new Date();
        const diffDays = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays <= 5) {
          this.weatherService.getWeather(event.provenanceEvenement).subscribe({
            next: (weather) => {
              if (weather) {
                this.weatherData[event.idEvenement] = {
                  temp: `${weather.temp}°C`,
                  icon: weather.icon
                };
              }
            },
            error: () => {} // Silent fail
          });
        }
      });
    }
  
    loadPastEvents(): void {
      this.loading = true;
      this.currentEventIndex = 0;
      this.evenementService.getEvenementsPast().subscribe({
        next: (data) => {
          this.evenements = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load past events.';
          this.loading = false;
        }
      });
    }
    loadRecentEvents(): void {
      this.loading = true;
      this.currentEventIndex = 0;
      this.evenementService.getEvenementsRecent().subscribe({
        next: (data) => {
          this.evenements =data
          this.filteredEvents = [...data]; // Initialize filteredEvents
          this.fetchWeatherForEvents();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load past events.';
          this.loading = false;
        }
      });
    }
    loadOldestEvents(): void {
      this.loading = true;
      this.currentEventIndex = 0;
      this.evenementService.getEvenementsOldest().subscribe({
        next: (data) => {
          this.evenements =data
          this.filteredEvents = [...data]; // Initialize filteredEvents
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load past events.';
          this.loading = false;
        }
      });
    }
    
    loadTodayEvents(): void {
      this.loading = true;
      this.currentEventIndex = 0;
      this.evenementService.getEvenementsToday().subscribe({
        next: (data) => {
          this.evenements = data;
          this.fetchWeatherForEvents();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load past events.';
          this.loading = false;
        }
      });
    }
    nextEvent(): void {
      if (this.currentEventIndex < this.evenements.length - 1) {
        this.currentEventIndex++;
      }
    }
  
    prevEvent(): void {
      if (this.currentEventIndex > 0) {
        this.currentEventIndex--;
      }
    }
  
    changeView(direction: 'previous' | 'next'): void {
      if (this.isTransitioning) return;
      
      this.isTransitioning = true;
      const titleElement = document.querySelector('.section-title');
      if (titleElement) {
        titleElement.classList.add('fade-out');
        
        setTimeout(() => {
          if (direction === 'previous') {
            if (this.currentView === 'Live Events') {
              this.currentView = 'All Events';
              this.loadOldestEvents(); // Or whichever default load you want
            } else if (this.currentView === 'All Events') {
              this.currentView = 'Upcoming Events';
              this.loadUpcomingEvents();
            } else if (this.currentView === 'Upcoming Events') {
              this.currentView = 'Previous Events';
              this.loadPastEvents();
            }
          } else {
            if (this.currentView === 'Previous Events') {
              this.currentView = 'Upcoming Events';
              this.loadUpcomingEvents();
            } else if (this.currentView === 'Upcoming Events') {
              this.currentView = 'All Events';
              this.loadOldestEvents(); // Or whichever default load you want
            } else if (this.currentView === 'All Events') {
              this.currentView = 'Live Events';
              this.loadTodayEvents();
            }
          }
          
          setTimeout(() => {
            titleElement.classList.remove('fade-out');
            titleElement.classList.add('fade-in');
            
            setTimeout(() => {
              titleElement.classList.remove('fade-in');
              this.isTransitioning = false;
            }, 500);
          }, 50);
        }, 500);
      } else {
        this.isTransitioning = false;
      }
    }
    onSortChange(): void {
      if (this.currentView === 'All Events') {
        if (this.selectedSort === 'oldest') {
          this.loadOldestEvents();
        } else {
          this.loadRecentEvents();
        }
        this.searchQuery = '';
    this.filterByName();
      }
    }
    toggleEventDetails(eventId: number): void {
      this.eventDetailsVisibility[eventId] = !this.eventDetailsVisibility[eventId];
    }
    getEventDetailsText(event: Evenement): string {
      const eventDate = new Date(event.dateEvenement);
      const today = new Date();
      
      // Reset times to compare only dates (ignores time)
      const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
      if (eventDay > currentDay) {
        return `This is an upcoming event: <strong>${event.nomEvenement}</strong>`;
      } 
      else if (eventDay < currentDay) {
        return `This was a past event: <strong>${event.nomEvenement}</strong>`;
      }
      else {
        return `🎉 <strong>LIVE NOW</strong>: ${event.nomEvenement}<br>
                Happening today at ${this.getAdjustedTime(event.dateEvenement)}!`;
      }
    }
    // Add this method for name-only filtering
    onSearch(): void {
      if (this.searchQuery.trim() === '') {
        // If search is empty, reload original events based on current sort
        this.onSortChange();
        return;
      }
    }
    filterByName(): void {
      if (!this.searchQuery || this.searchQuery.trim() === '') {
        this.filteredEvents = [...this.evenements]; // Show all events when no search query
        return;
      }
    
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredEvents = this.evenements.filter(event => 
        event.nomEvenement.toLowerCase().includes(query)
      );
    }
isLiveEvent(event: Evenement): boolean {
  const eventDate = new Date(event.dateEvenement);
  const today = new Date();
  
  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
}
isPastEvent(event: Evenement): boolean {
  return new Date(event.dateEvenement) < new Date();
}

openAftermovie(url: string): void {
  if (url) {
    window.open(url, '_blank');
  }
}
openGoogleMaps(location: string): void {
  if (!location) {
    console.warn('No location provided for this event');
    return;
  }

  // Clean and encode the location
  const cleanedLocation = location.trim();
  const encodedLocation = encodeURIComponent(cleanedLocation);
  
  // Open Google Maps with directions
  window.open(
    `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${encodedLocation}`,
    '_blank'  
  );
}
// Calculate deadline (day before event at 18:00)
getDeadline(eventDate: Date): Date {
  const deadline = new Date(eventDate);
  deadline.setDate(deadline.getDate() - 1); // Day before
  deadline.setHours(18, 0, 0, 0); // 6:00 PM
  return deadline;
}

// Calculate time remaining
getTimeRemaining(deadline: Date): {days: number, hours: number, minutes: number} {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  };
}
isRegistrationOpen(event: Evenement): boolean {
  if (this.currentView !== 'Upcoming Events') return false;
  const deadline = this.getDeadline(event.dateEvenement);
  return new Date() < deadline;
}
    // ... keep your existing getAdjustedTime and deleteEvenement methods ...
  
   getAdjustedTime(date: string | Date): string {
    const eventDate = new Date(date);
    eventDate.setHours(eventDate.getHours() - 0); // subtract 1 hour
  
    const hours = eventDate.getHours().toString().padStart(2, '0');
    const minutes = eventDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  deleteEvenement(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.evenementService.delete(id).subscribe({
        next: () => {
          this.evenements = this.evenements.filter(e => e.idEvenement !== id);
          alert('Event deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting event:', err);
          this.error = 'Failed to delete event. Please try again.';
        }
      });
    }
  }
  updateEvent(id: number, eventData: Evenement) {
    this.evenementService.updateEvenement(id, eventData).subscribe({
      next: (updatedEvent) => {
        // Handle successful update
        console.log('Event updated:', updatedEvent);
        // Refresh your events list or update local data
        this.loadRecentEvents(); // Assuming you have a method to reload events
        alert('Event updated successfully!');
      },
      error: (err) => {
        console.error('Error updating event:', err);
        alert('Failed to update event!');
      }
    });
  }
  editEvent(event: Evenement): void {
    this.router.navigate(['/admin/edit-event', event.idEvenement]);
  }
  navigateToNewEvent() {
    this.router.navigate(['/admin/newevent']);
  }
 
  async registerForEvent(event: Evenement) {
    this.isProcessing = true;
    try {
      // 1. Process payment
      const paymentSuccess = await lastValueFrom(
        this.paymentService.processPayment(event.prixEvenement)
      );
      if (!paymentSuccess) throw new Error('Payment failed');
  
      // 2. Prepare ticket data (without QR code)
      const userId = this.authService.getUserId();
      const ticketData = {
        evenement: { idEvenement: event.idEvenement },
        user: { idUser: userId },
        dateAchat: new Date(),
        qrCodeData: this.generateTicketHash(event.idEvenement,userId) // Generate unique hash

      };
  
      // 3. Create ticket with QR code (all handled in service)
    const createdTicket = await lastValueFrom(
        this.ticketService.createTicketWithQR(ticketData as unknown as TicketEvenement));
      alert(`Ticket purchased successfully!`);
    
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }
  
  // Helper method to generate unique ticket hash
  private generateTicketHash(eventId: number, userId: number | null): string {
    if (!userId) throw new Error('User ID is required');
    const timestamp = new Date().getTime();
    return `EVT-${eventId}-USR-${userId}-TS-${timestamp}`;
  }
  navigateToAIAssistant() {
    this.router.navigate(['/admin/ai-suggestions']);
  }
} 