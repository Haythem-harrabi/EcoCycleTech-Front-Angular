import { Component, OnInit } from '@angular/core';
import { CertificatRecyclageService } from '../../services/demande-recyclage/certificat-recyclage.service';

@Component({
  selector: 'app-certificate-recyclage',
  templateUrl: './certificate-recyclage.component.html',
  styleUrls: ['./certificate-recyclage.component.css']
})
export class CertificateRecyclageComponent implements OnInit {

  certificat: any = {};  // Add necessary structure for your object

  constructor(private certificatRecyclageService: CertificatRecyclageService) { }

  ngOnInit(): void {
    // Example: Save a certificat
    this.certificatRecyclageService.save(this.certificat).subscribe(response => {
      console.log('Certificat saved successfully', response);
    });
  }

  // You can also create update and delete methods in a similar way
}
