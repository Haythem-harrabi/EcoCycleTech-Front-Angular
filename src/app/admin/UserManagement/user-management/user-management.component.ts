import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  selectedUsers: any[] = [];
  user: any = {};
  loading: boolean = true;
  dialog: boolean = false;
  submitted: boolean = false;
  
  statuses: any[] = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users', life: 3000 });
        this.loading = false;
      }
    });
  }

  openNew() {
    this.user = {};
    this.submitted = false;
    this.dialog = true;
  }

  hideDialog() {
    this.dialog = false;
    this.submitted = false;
  }

  editUser(user: any) {
    // Clone the user to prevent modifying the original
    this.user = { ...user };
    this.dialog = true;
  }

  toggleUserStatus(user: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${user.active ? 'deactivate' : 'activate'} this user?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const updatedUser = { ...user, active: !user.active };
        this.userService.updateUser(updatedUser).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `User ${updatedUser.active ? 'activated' : 'deactivated'} successfully`,
              life: 3000
            });
            this.loadUsers();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update user status',
              life: 3000
            });
          }
        });
      }
    });
  }

  toggleUserBan(user: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${user.banned ? 'unban' : 'ban'} this user?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const updatedUser = { ...user, banned: !user.banned };
        this.userService.updateUser(updatedUser).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `User ${updatedUser.banned ? 'banned' : 'unbanned'} successfully`,
              life: 3000
            });
            this.loadUsers();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update user ban status',
              life: 3000
            });
          }
        });
      }
    });
  }

  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted successfully',
              life: 3000
            });
            this.loadUsers();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete user',
              life: 3000
            });
          }
        });
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }

  getUserRoleClass(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700';
      case 'MODERATOR':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  }
}