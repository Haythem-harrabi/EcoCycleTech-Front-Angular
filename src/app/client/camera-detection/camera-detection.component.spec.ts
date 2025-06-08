import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraDetectionComponent } from './camera-detection.component';

describe('CameraDetectionComponent', () => {
  let component: CameraDetectionComponent;
  let fixture: ComponentFixture<CameraDetectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CameraDetectionComponent]
    });
    fixture = TestBed.createComponent(CameraDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
