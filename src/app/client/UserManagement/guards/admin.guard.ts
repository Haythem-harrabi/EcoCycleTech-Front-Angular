import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // 1. Vérifie si l'utilisateur est connecté ET a le bon rôle
    const requiredRoles = route.data['roles'] as Array<string>;
    const user = this.authService.getCurrentUser(); // Implémentez cette méthode dans AuthService

    if (user && requiredRoles.includes(user.role)) {
      return true;
    }

    // 2. Redirige vers /login si non autorisé
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}