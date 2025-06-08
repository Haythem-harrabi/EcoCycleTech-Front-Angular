import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSuccessComponent } from './paymentsuccess.component';

describe('PaymentSuccessComponent', () => {
  let component: PaymentSuccessComponent;
  let fixture: ComponentFixture<PaymentSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaymentSuccessComponent] // since it's standalone
    });
    fixture = TestBed.createComponent(PaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
