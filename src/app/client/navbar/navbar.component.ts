import { Component, HostListener } from '@angular/core';
import { AuthService } from '../UserManagement/services/auth.service';
import { Router } from '@angular/router';
import { AppNotification, NotificationService } from '../UserManagement/services/notification.service';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/admin/models/reclamation.model';
import { SubscriptionService } from 'src/app/services/subscription.service';

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
  defaultAvatar = 'assets/img/default-avatar.png';
  hasSpace !: boolean;

  constructor(
    public authService: AuthService,
    private router: Router,
    private notif: NotificationService,
    private reclamationService: ReclamationService,
    private subscriptionService : SubscriptionService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((u) => {this.currentUser = u;
      console.log("User ="+ JSON.stringify(u))
      
    this.subscriptionService.getUserSpace(this.currentUser.id).subscribe(
      (data) => {
       
        console.log('Espace found:', data);
        this.hasSpace=true
      },
      (error) => {
        if (error.status === 404) {
          console.log('No espace found for this user.');
         this.hasSpace=false
        } else {
          console.error('An error occurred:', error);
          this.hasSpace=false
        }
      }
    )

    });

    this.notif.changes$.subscribe(list => {
      this.notifs = list;
      this.notifCount = list.length;
    });

    if (this.authService.hasUnverifiedMail()) {
      this.notifCount = 1;
    }
    this.fetchAllReclamations();

  }

  reclamations: Reclamation[] = [];
  errorMessage: string | null = null;
  isLoading = false;

  goToReclamationDetails(): void {
    const reclamationId = 1; // You may dynamically fetch this ID
    this.router.navigate(['/reclamation', reclamationId]);
  }

  goToAddReclamation(): void {
    this.router.navigate(['add/reclamation']);
  }

  goToReclamationsList(): void {
    this.router.navigate(['/reclamations']);
  }

  goToAllReclamationDetails(): void {
    this.router.navigate(['/claim']);
  }







  fetchAllReclamations(): void {
    this.isLoading = true;
    this.reclamationService.getAllReclamations().subscribe(
      (data) => {
        this.reclamations = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching all reclamations.';
        this.isLoading = false;
        console.error('Error fetching reclamations:', error);
      }
    );

  }

  loadUserProfile(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.photoDeProfil) {
      this.currentUser.photoDeProfil = this.getProfileImageUrl(this.currentUser.photoDeProfil);
    }
  }

  getProfileImageUrl(photoPath: string): string {
    if (!photoPath) return this.defaultAvatar;

    if (photoPath.startsWith('http')) return photoPath;
    if (photoPath.startsWith('data:')) return photoPath;
    if (photoPath.startsWith('assets/')) return photoPath;

    return `/api/uploads/${photoPath}`;
  }

  handleImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }

  toggleUserMenu(): void {
    this.isUserMenuVisible = !this.isUserMenuVisible;
    console.log('User menu visibility:', this.isUserMenuVisible);
  }

  getUserDisplayName(): string {
    if (!this.currentUser) return 'User';

    const displayName = this.currentUser.username ||
                       this.currentUser.name ||
                       this.currentUser.email;

    if (!displayName) return 'User';

    return typeof displayName === 'string'
      ? displayName.split(' ')[0]
      : 'User';
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  debugMouseDown(event: MouseEvent): void {
    console.log('Mouse down on Sign Out button', event);
  }

  debugPanelClick(event: MouseEvent): void {
    console.log('Click inside user-dropdown-panel', event.target);
  }

  logout(event: Event): void {
    event.stopPropagation();
    console.log('Logout clicked, menu visible:', this.isUserMenuVisible);
    this.authService.logout();
    this.currentUser = null;
    this.isUserMenuVisible = false;
  }



  // SetActive(event: MouseEvent) {
  //   const element = event.target as HTMLElement;
  //   const parentElement = element.closest('.nav-element') as HTMLElement;
  //   const dropdownelement = parentElement.querySelector('.dropdown-menu') as HTMLElement;

  //   if (parentElement.classList.contains('active')) {
  //     parentElement.classList.remove('active');
  //     dropdownelement.classList.add('hidden');
  //   } else {
  //     document.querySelectorAll('.active').forEach((el) => {
  //       el.classList.remove('active');
  //     });

  //     document.querySelectorAll('.dropdown-menu').forEach((dl) => {
  //       dl.classList.add('hidden');
  //     });

  //     if (parentElement) {
  //       parentElement.classList.add('active');
  //       dropdownelement.classList.remove('hidden');
  //       dropdownelement.classList.add('scalein');
  //     }
  //   }

  //   const navItems = document.querySelectorAll('.nav-element a');
  //   navItems.forEach(item => {
  //     item.classList.remove('active-nav-item');
  //   });
  //   (event.target as HTMLElement).classList.add('active-nav-item');
  // }

  markAsRead(n: AppNotification) {
    this.notif.remove(n.key);
  }

//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: MouseEvent) {
//     const target = event.target as HTMLElement;
//     const clickedInsideNav = target.closest('.nav-element');
//     const clickedInsideDropdown = target.closest('.dropdown-menu');
//     const clickedInsideUserMenu = target.closest('.user-menu-wrapper');
//     const clickedInsideUserDropdown = target.closest('.user-dropdown-panel');

//     if (!clickedInsideNav && !clickedInsideDropdown && !clickedInsideUserMenu && !clickedInsideUserDropdown) {
//       document.querySelectorAll('.dropdown-menu').forEach((el) => {
//         el.classList.add('hidden');
//       });

//       document.querySelectorAll('.nav-element.active').forEach((el) => {
//         el.classList.remove('active');
//       });

//       this.isUserMenuVisible = false;
//     }
//   }
// }



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
