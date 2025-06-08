import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { AccueilComponent } from './accueil/accueil.component';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './UserManagement/chat/chat.component';
import { EcoDriveAccueilComponent } from './GestionStockage/eco-drive-accueil/eco-drive-accueil.component';
import { EspaceStockageComponent } from './GestionStockage/espace-stockage/espace-stockage.component';
import { PaypalComponent } from './GestionStockage/paypal/paypal.component';
import { FileUploadModule } from 'primeng/fileupload';
import { CloudinaryModule } from '@cloudinary/ng';
import {
  BreadcrumbModule,
} from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { ToastModule} from 'primeng/toast';
import { TableModule} from 'primeng/table';
import { NgxFilesizeModule } from 'ngx-filesize';
import { SelectButtonModule }from 'primeng/selectbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CameraDetectionComponent } from './camera-detection/camera-detection.component';
import { CarouselModule } from 'primeng/carousel';



@NgModule({
  declarations: [
    LayoutComponent,
    NavbarComponent,
    FooterComponent,
    ChatComponent,
    EcoDriveAccueilComponent,
    PaypalComponent,
    EspaceStockageComponent,
    AccueilComponent,
    CameraDetectionComponent
    ],
  imports: [
    CommonModule,
    DividerModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    StyleClassModule,
    //added by user
    FormsModule,
    NgxPayPalModule,
     CardModule,
     TagModule,
     FileUploadModule,
     CloudinaryModule,
     BreadcrumbModule,
     DialogModule,
     ToastModule,
     TableModule,
    NgxFilesizeModule,  
     SelectButtonModule,
     ProgressSpinnerModule,
     ProgressBarModule,
     NgChartsModule,
     LeafletModule,
     CarouselModule
  
  ],
  exports: [LayoutComponent]
})
export class LayoutModule { }
