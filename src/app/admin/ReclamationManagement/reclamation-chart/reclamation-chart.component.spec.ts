import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationChartComponent } from './reclamation-chart.component';

describe('ReclamationChartComponent', () => {
  let component: ReclamationChartComponent;
  let fixture: ComponentFixture<ReclamationChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReclamationChartComponent]
    });
    fixture = TestBed.createComponent(ReclamationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
