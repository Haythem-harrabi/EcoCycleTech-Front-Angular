import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AddReservationComponent } from './add-reservation.component';
import { ReservationService } from '../services/reservation.service';
import { AppareilService } from '../services/appareil.service';
import { PanierService } from '../services/panier.service';

describe('AddReservationComponent', () => {
  let component: AddReservationComponent;
  let fixture: ComponentFixture<AddReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddReservationComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        RouterTestingModule
      ],
      providers: [
        ReservationService,
        AppareilService,
        PanierService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    expect(component.reservationForm.contains('client')).toBeTruthy();
    expect(component.reservationForm.contains('date')).toBeTruthy();
    expect(component.reservationForm.contains('appareils')).toBeTruthy();
  });

  it('should require client name with minimum 3 characters', () => {
    const control = component.reservationForm.get('client');
    control?.setValue('ab');
    expect(control?.valid).toBeFalsy();
    control?.setValue('abc');
    expect(control?.valid).toBeTruthy();
  });
});