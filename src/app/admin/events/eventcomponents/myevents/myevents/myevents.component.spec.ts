import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyeventsComponent } from './myevents.component';

describe('MyeventsComponent', () => {
  let component: MyeventsComponent;
  let fixture: ComponentFixture<MyeventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyeventsComponent]
    });
    fixture = TestBed.createComponent(MyeventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
