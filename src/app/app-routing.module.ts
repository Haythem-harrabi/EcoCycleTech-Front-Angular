import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './client/layout/layout.component';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { LoginComponent } from './client/UserManagement/login/login.component';
import { AdminGuard } from './client/UserManagement/guards/admin.guard';
import { Role } from './client/UserManagement/enum/role';
import { VerifyEmailComponent } from './client/UserManagement/verify-email/verify-email.component';
import { OAuth2RedirectComponent } from './client/UserManagement/oauth2-redirect/oauth2-redirect.component';
import { UserProfileComponent } from './client/UserManagement/user-profile/user-profile.component';
import { AuthGuard } from './client/UserManagement/guards/auth.guard';
import { UserManagementComponent } from './admin/UserManagement/user-management/user-management.component';
import { CheckEmailComponent } from './client/UserManagement/check-email/check-email.component';
import { NotificationsComponent } from './client/UserManagement/notifications/notifications.component';
const routes: Routes = [
  {
    path: '', 
    component: LayoutComponent,
    children: [
      { path: '', component: AccueilComponent },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [AuthGuard] // Protect the profile route
    
     },
     { path: 'notifications',component: NotificationsComponent}
    ]
  },
  
  { path: 'login', component: LoginComponent },
  {
    path: 'admin', 
    component: AdminLayoutComponent,
    canActivate: [AdminGuard], // Protection de la route admin
    data: { roles: [Role.ADMIN] },// Rôle requis (remplacez par votre logique)
    children: [
      { path: 'users', component: UserManagementComponent },  // Make sure this component exists
      //{ path: 'user-statistics', component: UserStatisticsComponent } // Same for this
    ] 
  },
  { path: 'notifications',component: NotificationsComponent},
  { path: 'check-email', component: CheckEmailComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'oauth2/redirect', component: OAuth2RedirectComponent },
  { path: 'oauth2/callback', component: OAuth2RedirectComponent },
  // Redirection pour les routes non trouvées
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
