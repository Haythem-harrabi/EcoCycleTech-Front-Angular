import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceStockageComponent } from './espace-stockage.component';

describe('EspaceStockageComponent', () => {
  let component: EspaceStockageComponent;
  let fixture: ComponentFixture<EspaceStockageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspaceStockageComponent]
    });
    fixture = TestBed.createComponent(EspaceStockageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
