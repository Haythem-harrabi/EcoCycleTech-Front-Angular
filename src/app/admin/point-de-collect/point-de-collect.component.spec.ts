import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointDeCollectComponent } from './point-de-collect.component';

describe('PointDeCollectComponent', () => {
  let component: PointDeCollectComponent;
  let fixture: ComponentFixture<PointDeCollectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PointDeCollectComponent]
    });
    fixture = TestBed.createComponent(PointDeCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
