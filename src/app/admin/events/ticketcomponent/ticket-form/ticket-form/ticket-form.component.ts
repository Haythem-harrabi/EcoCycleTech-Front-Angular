import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketServiceService } from '../../../service/ticket-service.service';
import { Router } from '@angular/router';
import { TicketEvenement } from '../../../models/ticket-evenement.model';
@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.css']
})
export class TicketFormComponent {
  ticketForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketServiceService,
    private router: Router
  ) {
    this.ticketForm = this.fb.group({
      eventId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      userId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      purchaseDate: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      const formData = {
        evenement: { idEvenement: +this.ticketForm.value.eventId },
        user: { idUser: +this.ticketForm.value.userId },
        dateAchat: this.ticketForm.value.purchaseDate
      };

      this.ticketService.createTicket(formData as unknown as TicketEvenement).subscribe({
        next: () =>{
           this.router.navigate(['/admin/tickets']),
           alert('Ticket created successfully!');
        },
        error: (err) => alert('Error creating ticket: ' + err.message)
      });
    }
  }
  navigateToTickets() {
    this.router.navigate(['/admin/tickets']);
  }
}