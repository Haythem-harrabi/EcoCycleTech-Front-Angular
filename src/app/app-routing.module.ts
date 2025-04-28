import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './client/layout/layout.component';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { PointDeCollectComponent } from './admin/point-de-collect/point-de-collect.component';
import { PointdeventefComponent } from './client/pointdeventef/pointdeventef.component';
import { VehiculeListComponent } from './admin/point-de-collect/vehicule-list/vehicule-list.component';
import { CameraDetectionComponent } from './client/camera-detection/camera-detection.component';

const routes: Routes = [

  {path : 'camera',component : CameraDetectionComponent},
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: AccueilComponent },
      { path: 'pointdeventef', component: PointdeventefComponent },

    ]
    
},
{
  path: 'admin', component: AdminLayoutComponent,
  children: [
    { path: 'pointsdecollecte', component: PointDeCollectComponent }, 
    { path: 'VehiculeList', component: VehiculeListComponent }, 


  ]

},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
