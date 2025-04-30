import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcodriveChartsComponent } from './ecodrive-charts.component';

describe('EcodriveChartsComponent', () => {
  let component: EcodriveChartsComponent;
  let fixture: ComponentFixture<EcodriveChartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EcodriveChartsComponent]
    });
    fixture = TestBed.createComponent(EcodriveChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
