import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListdemanderecycleComponent } from './listdemanderecycle.component';

describe('ListdemanderecycleComponent', () => {
  let component: ListdemanderecycleComponent;
  let fixture: ComponentFixture<ListdemanderecycleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListdemanderecycleComponent]
    });
    fixture = TestBed.createComponent(ListdemanderecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
