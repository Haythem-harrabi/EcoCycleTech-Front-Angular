import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.css']
})
export class AdminFooterComponent {
  constructor(public layoutService: LayoutService) { }
}
