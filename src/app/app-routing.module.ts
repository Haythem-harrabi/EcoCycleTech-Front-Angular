import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './client/layout/layout.component';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { LoginComponent } from './client/UserManagement/login/login.component';
import { AdminGuard } from './client/UserManagement/guards/admin.guard';
import { Role } from './client/UserManagement/enum/role';
import { VerifyEmailComponent } from './client/UserManagement/verify-email/verify-email.component';

const routes: Routes = [
  {
    path: '', 
    component: LayoutComponent,
    children: [
      { path: '', component: AccueilComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin', 
    component: AdminLayoutComponent,
    canActivate: [AdminGuard], // Protection de la route admin
    data: { roles: [Role.ADMIN] } // Rôle requis (remplacez par votre logique)
  },
  { path: 'verify-email', component: VerifyEmailComponent }, // Add this route
  // Redirection pour les routes non trouvées
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
