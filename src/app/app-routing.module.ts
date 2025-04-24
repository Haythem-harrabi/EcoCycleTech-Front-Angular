import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './client/layout/layout.component';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DemandeRecycleComponent } from './client/demande-recycle/demande-recycle.component';
import { CertificateRecyclageComponent } from './client/certificate-recyclage/certificate-recyclage.component';
import { ListdemanderecycleComponent } from './admin/demande-recycle/listdemanderecycle/listdemanderecycle.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: AccueilComponent, pathMatch: 'full' },
      { path: 'demanderecycle', component: DemandeRecycleComponent },
      { path: 'certificaterecyclage', component: CertificateRecyclageComponent },
    ]
    
},
{
  path: 'admin', component: AdminLayoutComponent,
  children: [
    {
      path: 'listdemanderecycle', component: ListdemanderecycleComponent 
    }
    
  ]
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
