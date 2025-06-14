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
                  { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },


              ]
          },
          {
            label:'Device Management',
            items:[
              { label: 'Reservations', icon: 'pi pi-fw pi-calendar', routerLink: ['Reservations'] },
              { label: 'Appareils', icon: 'pi pi-fw pi-desktop', routerLink: ['Appareils'] },
              { label: 'Avis', icon: 'pi pi-fw pi-desktop', routerLink: ['Avis']},
              { label: 'events', icon: 'pi pi-fw pi-desktop', routerLink: ['events']},


            ]
          },
          {
              label: 'User Management',
              items: [
                  { label: 'Users List', icon: 'pi pi-fw pi-users', routerLink: ['/admin/users'] },
                  { label: 'User Statistics', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/admin/user-statistics'] }
              ]
          },
          {
            label: 'EcoDrive',
            items: [
                { label: 'Overview', icon: 'pi pi-fw pi-database', routerLink: ['/admin/Plans'] },
                { label: 'Add storage plan', icon: 'pi pi-fw pi-plus-circle', routerLink: ['/admin/addPlan'] }
            ]
        },
          {
            label: 'Event Management',
            items: [
              { label: 'Events', icon: 'pi pi-fw pi-calendar', routerLink: ['/admin/events'] },
              { label: 'Tickets', icon: 'pi pi-fw pi-ticket', routerLink: ['/admin/tickets'] }
            ]
        },
        {
          label: 'Reclamation Management',
          items: [
            { label: 'Reclamation', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/list/reclamation'] },
          { label: 'Support Reclamation', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/listSupportReclamation'] },
          { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/admin/chart'] }

          ]
      },
      {
        label: 'Demande Recycle Management',
        items: [
          { label: 'Demande List', icon: 'pi pi-fw pi-list', routerLink: ['listdemanderecycle'] },

        ]
    },
    {
        label: 'Vehicle & Collection Management',
        items: [
          {
            label: 'Collection Points',
            icon: 'pi pi-fw pi-map-marker',
            routerLink: ['/admin/pointsdecollecte']
          },
          {
            label: 'Vehicles',
            icon: 'pi pi-fw pi-truck',
            routerLink: ['/admin/VehiculeList']
          },
          {
            label: 'Collection List',
            icon: 'pi pi-fw pi-calendar-plus',
            routerLink: ['/admin/CollectionList']
          }
        ]
      },

          {
              label: 'UI Components',
              items: [
                  { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                  { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                  { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                  { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
                  { label: 'Button', icon: 'pi pi-fw pi-mobile', routerLink: ['/uikit/button'], class: 'rotated-icon' },
                  { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                  { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                  { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                  { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                  { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                  { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                  { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], preventExact: true },
                  { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                  { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                  { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                  { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] },
                  { label: 'MyDashBoard', icon: 'pi pi-fw pi-id-card', routerLink: ['/mydashboard'] }
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
          },
          {
              label: 'Get Started',
              items: [
                  {
                      label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
                  },
                  {
                      label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
                  }
              ]
          }
      ];
  }
}
