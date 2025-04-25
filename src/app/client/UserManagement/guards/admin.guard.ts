import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Get current user synchronously first
    const user = this.authService.getCurrentUser();
    
    if (user && user.role === 'ADMIN') {
      return of(true);
    }

    return this.authService.validateToken().pipe(
      switchMap(isValid => {
        if (!isValid) {
          this.authService.storeRedirectUrl(state.url);
          this.router.navigate(['/login']);
          return of(false);
        }

        const requiredRoles = route.data['roles'] as Array<string>;
        const user = this.authService.getCurrentUser();
        
        if (!user || !user.role) {
          this.authService.storeRedirectUrl(state.url);
          this.router.navigate(['/login']);
          return of(false);
        }
        
        const hasRequiredRole = requiredRoles.includes(user.role);
        
        if (hasRequiredRole) {
          return of(true);
        }
        
        // If not authorized, redirect to home or access denied
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}