import { ReservationConfirmationDialogComponent } from "./comfirmationdialog.component";
  import { ComponentFixture, TestBed } from '@angular/core/testing';
describe('ComfirmationdialogComponent', () => {
  let component: ReservationConfirmationDialogComponent;
  let fixture: ComponentFixture<ReservationConfirmationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationConfirmationDialogComponent]
    });
    fixture = TestBed.createComponent(ReservationConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
