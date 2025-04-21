import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateRecyclageComponent } from './certificate-recyclage.component';

describe('CertificateRecyclageComponent', () => {
  let component: CertificateRecyclageComponent;
  let fixture: ComponentFixture<CertificateRecyclageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificateRecyclageComponent]
    });
    fixture = TestBed.createComponent(CertificateRecyclageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
