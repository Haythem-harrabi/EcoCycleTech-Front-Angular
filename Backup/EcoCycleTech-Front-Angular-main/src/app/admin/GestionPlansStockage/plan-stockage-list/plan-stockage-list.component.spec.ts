import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanStockageListComponent } from './plan-stockage-list.component';

describe('PlanStockageListComponent', () => {
  let component: PlanStockageListComponent;
  let fixture: ComponentFixture<PlanStockageListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanStockageListComponent]
    });
    fixture = TestBed.createComponent(PlanStockageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
