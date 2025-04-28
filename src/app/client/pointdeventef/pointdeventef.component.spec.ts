import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointdeventefComponent } from './pointdeventef.component';

describe('PointdeventefComponent', () => {
  let component: PointdeventefComponent;
  let fixture: ComponentFixture<PointdeventefComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PointdeventefComponent]
    });
    fixture = TestBed.createComponent(PointdeventefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
