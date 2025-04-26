import { Component, HostListener } from '@angular/core';
import { AuthService } from '../UserManagement/services/auth.service';
import { Router } from '@angular/router';
import { AppNotification, NotificationService } from '../UserManagement/services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUser: any = null;
  isUserMenuVisible = false;
  notifCount = 0;         
  notifs: AppNotification[] = [];      
  defaultAvatar = 'assets/img/default-avatar.png'; // Updated path

  constructor(
    public authService: AuthService,
    private router: Router,
    private notif:NotificationService
  ) {}

  ngOnInit(): void {
    //à vérifier ken enahiha ou bien nkhaliha 
    //this.loadUserProfile();
    this.authService.currentUser$.subscribe(u => this.currentUser = u);

    /* pastille rouge */
    this.notif.changes$.subscribe(list => {
      this.notifs     = list;
      this.notifCount = list.length;
    });
    /* rafraîchir au démarrage (rechargement de page) */
    if (this.authService.hasUnverifiedMail()) {
      this.notifCount = 1;
    }
  }

  loadUserProfile(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.photoDeProfil) {
      this.currentUser.photoDeProfil = this.getProfileImageUrl(this.currentUser.photoDeProfil);
    }
  }

  getProfileImageUrl(photoPath: string): string {
    if (!photoPath) return this.defaultAvatar;
    
    // Handle different image source cases:
    if (photoPath.startsWith('http')) return photoPath; // External URL
    if (photoPath.startsWith('data:')) return photoPath; // Base64 encoded
    if (photoPath.startsWith('assets/')) return photoPath; // Local asset
    
    // API served image - adjust based on your API
    return `/api/uploads/${photoPath}`; // Or your API endpoint
  }

  handleImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }


  toggleUserMenu(): void {
    this.isUserMenuVisible = !this.isUserMenuVisible;
  }

  showUserMenu(show: boolean): void {
    if (window.innerWidth > 992) { // Desktop seulement
      this.isUserMenuVisible = show;
    }
  }
  
  getUserDisplayName(): string {
    if (!this.currentUser) return 'User';
    
    // Try multiple possible name fields
    const displayName = this.currentUser.username || 
                       this.currentUser.name || 
                       this.currentUser.email;
    
    if (!displayName) return 'User';
    
    // Safe split operation
    return typeof displayName === 'string' 
      ? displayName.split(' ')[0] 
      : 'User';
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null; // Clear local reference

  }



  SetActive(event: MouseEvent){
    const element = event.target as HTMLElement;
    const parentElement = element.closest('.nav-element') as HTMLElement;
    const dropdownelement = parentElement.querySelector('.dropdown-menu') as HTMLElement;
    
    console.log(parentElement);
    
    console.log(dropdownelement);
    if (parentElement.classList.contains('active')){
      parentElement.classList.remove('active')
      dropdownelement.classList.add('hidden')
      
    }
    else {
    // Remove active class from all side-elements and sub-side-elements
    document.querySelectorAll('.active').forEach((el) => {
      el.classList.remove('active');
    });
    
    document.querySelectorAll('.dropdown-menu').forEach((dl) => {
       dl.classList.add('hidden');
    });

    // Add active class to the clicked element
    if (parentElement) {
      parentElement.classList.add('active');
      dropdownelement.classList.remove('hidden');
      dropdownelement.classList.add('scalein');
    }

    
  }
  const navItems = document.querySelectorAll('.nav-element a');
    navItems.forEach(item => {
      item.classList.remove('active-nav-item');
    });
    (event.target as HTMLElement).classList.add('active-nav-item');
  }
/** appelé par le bouton OK dans le menu */
markAsRead(n: AppNotification) {
  this.notif.remove(n.key);       // retire du store…
  // la sous-liste et le compteur se mettront à jour
}

// handle clicks outside the dropdowns
  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const clickedInsideNav = target.closest('.nav-element');
  const clickedInsideDropdown = target.closest('.dropdown-menu');

  if (!clickedInsideNav && !clickedInsideDropdown) {
    document.querySelectorAll('.dropdown-menu').forEach((el) => {
      el.classList.add('hidden');
    });

    document.querySelectorAll('.nav-element.active').forEach((el) => {
      el.classList.remove('active');
    });
  }
}
}
