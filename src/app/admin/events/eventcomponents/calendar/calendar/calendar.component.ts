import { Component, OnInit } from '@angular/core';
import { EvenementService } from '../../../service/event-service.service';
import { Evenement } from '../../../models/evenement.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  // Current date data
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  
  // Selected date data
  selectedYear: number = this.currentYear;
  selectedMonth: number = this.currentMonth;
  
  // Calendar data
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = [];
  daysInMonth: number[] = [];
  firstDayOfMonth: number = 0;
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Events data
  allEvents: Evenement[] = [];
  filteredEvents: Evenement[] = [];
  loading: boolean = false;
  error: string = '';
  private eventsCache: { [key: string]: Evenement[] } = {};
  constructor(private evenementService: EvenementService,  private cdRef: ChangeDetectorRef) {
    // Generate years array (5 years back and 5 years ahead)
    const startYear = this.currentYear - 5;
    for (let i = 0; i < 11; i++) {
      this.years.push(startYear + i);
    }
  }
  
  ngOnInit(): void {
    // First calculate the calendar
    this.calculateCalendar();
    
    // Then load events - loading will trigger filterEventsByMonth when complete
    this.loadEvents();
    
    // Add component initialization logging
    console.log('Calendar component initialized with:', {
      year: this.selectedYear,
      month: this.selectedMonth,
      monthName: this.months[this.selectedMonth]
    });
  }
  
  loadEvents(): void {
    if (this.loading) return;
    
    this.loading = true;
    console.log('Loading events...');
    
    this.evenementService.getEvenementsRecent().subscribe({
      next: (data) => {
        console.log('Events loaded successfully:', data.length, 'events');
        this.allEvents = data;
        this.filterEventsByMonth();
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load events. Please try again later.';
        this.loading = false;
        console.error('Error loading events:', err);
        this.cdRef.detectChanges();
      }
    });
  }
  
  calculateCalendar(): void {
    // Get days in month and first day of month
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    this.firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
    
    // Reset and fill daysInMonth array
    this.daysInMonth = [];
    for (let i = 1; i <= daysInMonth; i++) {
      this.daysInMonth.push(i);
    }
  }
  filterEventsByMonth(): void {
    const cacheKey = `${this.selectedYear}-${this.selectedMonth}`;
    
    // Return cached events if available
    if (this.eventsCache[cacheKey]) {
      this.filteredEvents = this.eventsCache[cacheKey];
      this.cdRef.detectChanges();
      return;
    }
  
    if (!this.allEvents || this.allEvents.length === 0) {
      this.loadEvents();
      return;
    }
  
    this.filteredEvents = this.allEvents.filter(event => {
      if (!event.dateEvenement) return false;
      
      // Create date object and apply your time adjustment
      const eventDate = new Date(event.dateEvenement);
      eventDate.setHours(eventDate.getHours() - 1); // Apply your -1 hour adjustment
      
      // Create comparison date (at midnight to avoid time issues)
      const compareDate = new Date(this.selectedYear, this.selectedMonth, 1);
      
      return eventDate.getFullYear() === compareDate.getFullYear() && 
             eventDate.getMonth() === compareDate.getMonth();
    });
  
    // Cache the results
    this.eventsCache[cacheKey] = this.filteredEvents;
    
    // Debug logging
    console.log(`Events for ${this.months[this.selectedMonth]} ${this.selectedYear}:`, this.filteredEvents);
    console.log('All events:', this.allEvents.map(e => ({
      name: e.nomEvenement,
      date: new Date(e.dateEvenement),
      adjustedDate: new Date (new Date(e.dateEvenement).setHours(new Date(e.dateEvenement).getHours() - 1))
    })));
    
    this.cdRef.detectChanges();
  }
  
  
  onMonthChange(): void {
    console.log('Month changed to:', this.months[this.selectedMonth]);
    this.calculateCalendar();
    this.filterEventsByMonth();
  }
  
  onYearChange(): void {
    console.log('Year changed to:', this.selectedYear);
    this.calculateCalendar();
    this.filterEventsByMonth();
  }
  
  hasEventOnDay(day: number): boolean {
    return this.filteredEvents.some(event => {
      const eventDate = new Date(event.dateEvenement);
      return eventDate.getDate() === day;
    });
  }
  
  getEventsForDay(day: number): Evenement[] {
    return this.filteredEvents.filter(event => {
      const eventDate = new Date(event.dateEvenement);
      return eventDate.getDate() === day;
    });
  }
  
  getEventDay(event: Evenement): number {
    return new Date(event.dateEvenement).getDate();
  }
  
  getEventMonthShort(event: Evenement): string {
    const monthIndex = new Date(event.dateEvenement).getMonth();
    return this.months[monthIndex].substring(0, 3);
  }
  
  getEventTime(event: Evenement): string {
    const date = new Date(event.dateEvenement);
    date.setTime(date.getTime() - 3600000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
