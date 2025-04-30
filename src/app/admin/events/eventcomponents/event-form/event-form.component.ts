import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvenementService } from '../../service/event-service.service';
import { Evenement } from '../../models/evenement.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId?: number;

  constructor(
    private fb: FormBuilder,
    private eventService: EvenementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      nomEvenement: ['', Validators.required],
      dateEvenement: ['', Validators.required], // Will store full ISO string
      localisationEvenement: ['', Validators.required],
      nbrPlacesEvenement: ['', [Validators.required, Validators.min(1)]],
      prixEvenement: ['', [Validators.required, Validators.min(0)]],
      provenanceEvenement: ['', Validators.required],
      aftermovie: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.eventId = +params['id'];
        this.loadEventForEdit(this.eventId);
      }
    });
  }

  loadEventForEdit(id: number): void {
    this.eventService.getEvenementById(id).subscribe({
      next: (event) => {
        // Convert to local datetime string for the input
        const localDateTime = this.toLocalDateTimeString(event.dateEvenement.toString());
        this.eventForm.patchValue({
          ...event,
          dateEvenement: localDateTime
        });
      },
      error: (err) => {
        console.error('Error loading event:', err);
        alert('Failed to load event data');
      }
    });
  }

  private toLocalDateTimeString(isoString: string): string {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  }

  private toISODateTimeString(localDateTime: string): string {
    const date = new Date(localDateTime);
    return date.toISOString(); // "YYYY-MM-DDTHH:MM:SS.SSSZ"
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      
      // Prepare the data for API
      const eventData: Evenement = {
        ...formData,
        dateEvenement: new Date(formData.dateEvenement).toISOString(),
        // Include ID only in edit mode
        ...(this.isEditMode && { idEvenement: this.eventId }),
        ticketEvenementList: [] // Add empty array if your backend requires it
      };
  
      if (this.isEditMode && this.eventId) {
        this.eventService.updateEvenement(this.eventId, eventData).subscribe({
          next: () => {
            alert('Event updated successfully!');
            this.router.navigate(['/admin/events']);
          },
          error: (err) => {
            console.error('Update error:', err);
            alert('Error updating event. Please try again.');
          }
        });
      } else {
        this.eventService.createEvenement(eventData).subscribe({
          next: () => {
            alert('Event created successfully!');
            this.router.navigate(['/admin/events']);
          },
          error: (err) => {
            console.error('Error creating event:', err);
            alert('Error creating event. Please try again.');
          }
        });
      }
    }
  }

  navigateToEvents() {
    this.router.navigate(['/admin/events']);
  }
}