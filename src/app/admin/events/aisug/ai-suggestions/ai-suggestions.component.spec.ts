import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSuggestionsComponent } from './ai-suggestions.component';

describe('AiSuggestionsComponent', () => {
  let component: AiSuggestionsComponent;
  let fixture: ComponentFixture<AiSuggestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiSuggestionsComponent]
    });
    fixture = TestBed.createComponent(AiSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
