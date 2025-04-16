import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {

  model: any[] = [];

  constructor(public layoutService: LayoutService) { }

  ngOnInit() {
      this.model = [
          {
              label: 'Home',
              items: [
                  { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
              ]
          },
          {
              label: 'Manage',
              items: [
                { label: 'Eco-Drive', icon: 'pi pi-fw pi-database',
                items: [
                    { label: 'Overview', icon: 'pi pi-fw pi-server' },
                    { label: 'Add storage plan', icon: 'pi pi-fw pi-plus-circle' },
                ] },
                  { label: 'Repairing operations', icon: 'pi pi-fw pi-check-square', routerLink: ['##'] },
                  { label: 'Recycling operations', icon: 'pi pi-fw pi-bookmark', routerLink: ['##'] },
                  { label: 'Events', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['##'] },
                  { label: 'Eco-Drive', icon: 'pi pi-fw pi-mobile', routerLink: ['##'], class: 'rotated-icon' },
                  { label: 'Pickup stations', icon: 'pi pi-fw pi-table', routerLink: ['##'] },
              ]
          },
          {
              label: 'Prime Blocks',
              items: [
                  { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
                  { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
              ]
          },
          {
              label: 'Utilities',
              items: [
                  { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
                  { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
              ]
          },
          {
              label: 'Pages',
              icon: 'pi pi-fw pi-briefcase',
              routerLink: ['/pages'],
              items: [
                  {
                      label: 'Landing',
                      icon: 'pi pi-fw pi-globe',
                      routerLink: ['/landing']
                  },
                  {
                      label: 'Auth',
                      icon: 'pi pi-fw pi-user',
                      items: [
                          {
                              label: 'Login',
                              icon: 'pi pi-fw pi-sign-in',
                              routerLink: ['/auth/login']
                          },
                          {
                              label: 'Error',
                              icon: 'pi pi-fw pi-times-circle',
                              routerLink: ['/auth/error']
                          },
                          {
                              label: 'Access Denied',
                              icon: 'pi pi-fw pi-lock',
                              routerLink: ['/auth/access']
                          }
                      ]
                  },
                  {
                      label: 'Crud',
                      icon: 'pi pi-fw pi-pencil',
                      routerLink: ['/pages/crud']
                  },
                  {
                      label: 'Timeline',
                      icon: 'pi pi-fw pi-calendar',
                      routerLink: ['/pages/timeline']
                  },
                  {
                      label: 'Not Found',
                      icon: 'pi pi-fw pi-exclamation-circle',
                      routerLink: ['/pages/notfound']
                  },
                  {
                      label: 'Empty',
                      icon: 'pi pi-fw pi-circle-off',
                      routerLink: ['/pages/empty']
                  },
              ]
          },
          {
              label: 'Hierarchy',
              items: [
                  {
                      label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                      items: [
                          {
                              label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                              items: [
                                  { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                  { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                  { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                              ]
                          },
                          {
                              label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                              items: [
                                  { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                              ]
                          },
                      ]
                  },
                  {
                      label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                      items: [
                          {
                              label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                              items: [
                                  { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                  { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                              ]
                          },
                          {
                              label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                              items: [
                                  { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                              ]
                          },
                      ]
                  }
              ]
          }
      ];
  }
}
