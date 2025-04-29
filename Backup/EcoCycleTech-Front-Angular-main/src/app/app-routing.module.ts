import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './client/layout/layout.component';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { ReclamationDetailsComponent } from './client/reclamation-details/reclamation-details.component'; // Adjust the path as needed
import { ReclamationListComponent } from './reclamation-list/reclamation-list.component';
import { NavbarComponent } from './client/navbar/navbar.component';  // A

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: AccueilComponent },
    ]
    
},
{ path: 'claim', component: ReclamationComponent },
{
  path: 'admin', component: AdminLayoutComponent,
},
{ path: 'reclamation/:id', component: ReclamationDetailsComponent },
{ path: 'reclamations',  component:ReclamationListComponent  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
