import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './client/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AddPlanStockageComponent } from './admin/GestionPlansStockage/add-plan-stockage/add-plan-stockage.component';
import { PlanStockageListComponent } from './admin/GestionPlansStockage/plan-stockage-list/plan-stockage-list.component';
import { EventListComponent } from './admin/events/eventcomponents/event-list/event-list.component';
import { EventFormComponent } from './admin/events/eventcomponents/event-form/event-form.component';
import { HistoryComponent } from './admin/events/eventcomponents/history/history/history.component';
import { MyeventsComponent } from './admin/events/eventcomponents/myevents/myevents/myevents.component';
import { CalendarComponent } from './admin/events/eventcomponents/calendar/calendar/calendar.component';
import { TicketListComponent } from './admin/events/ticketcomponent/ticket-list/ticket-list/ticket-list.component';
import { TicketFormComponent } from './admin/events/ticketcomponent/ticket-form/ticket-form/ticket-form.component';
import { AISuggestionsComponent } from './admin/events/aisug/ai-suggestions/ai-suggestions.component';
import { AISuggestionService } from './admin/events/service/ai-suggestion.service';
import { WeatherService } from './admin/events/service/weather-service.service';
import { D17PaymentService } from './admin/events/service/d17-payment.service';
import { TicketServiceService } from './admin/events/service/ticket-service.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AdminLayoutModule } from './admin/admin-layout.module';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { EcoDriveAccueilComponent } from './client/GestionStockage/eco-drive-accueil/eco-drive-accueil.component';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    AddPlanStockageComponent,
    PlanStockageListComponent,
    EventListComponent,
    EventFormComponent,
    HistoryComponent,
    MyeventsComponent,
    CalendarComponent,
    TicketListComponent,
    TicketFormComponent,
    AISuggestionsComponent,
    
    NotfoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    AdminLayoutModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    MessageModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
