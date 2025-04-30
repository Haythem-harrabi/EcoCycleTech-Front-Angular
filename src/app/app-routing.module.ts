import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './client/layout/layout.component';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { EventListComponent } from './admin/events/eventcomponents/event-list/event-list.component';
import { CalendarComponent } from './admin/events/eventcomponents/calendar/calendar/calendar.component';
import { EventFormComponent } from './admin/events/eventcomponents/event-form/event-form.component';
import { TicketListComponent } from './admin/events/ticketcomponent/ticket-list/ticket-list/ticket-list.component';
import { TicketFormComponent } from'./admin/events/ticketcomponent/ticket-form/ticket-form/ticket-form.component';
import { AISuggestionsComponent } from './admin/events/aisug/ai-suggestions/ai-suggestions.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: AccueilComponent },
      { path: 'events', component: EventListComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'tickets', component: TicketListComponent }
    ]
    
},
{
  path: 'admin', component: AdminLayoutComponent,
  children: [
    { path: 'events', component: EventListComponent },
    { path: 'newevent', component: EventFormComponent },
    { path: 'edit-event/:id', component: EventFormComponent },
    { path: 'tickets', component: TicketListComponent },
    { path: 'newticket', component: TicketFormComponent },
    { path: 'ai-suggestions', component: AISuggestionsComponent }
 ] },
  {
    path: '', loadChildren: () => import('./client/layout.module').then(m => m.LayoutModule)
    
},
{
  path: 'admin',
  loadChildren: () => import('./admin/admin-layout.module').then(m => m.AdminLayoutModule)
},
{
  path: '**', component: NotfoundComponent,
},
  ]



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
