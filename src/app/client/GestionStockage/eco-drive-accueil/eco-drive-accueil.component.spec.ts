import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoDriveAccueilComponent } from './eco-drive-accueil.component';

describe('EcoDriveAccueilComponent', () => {
  let component: EcoDriveAccueilComponent;
  let fixture: ComponentFixture<EcoDriveAccueilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EcoDriveAccueilComponent]
    });
    fixture = TestBed.createComponent(EcoDriveAccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
