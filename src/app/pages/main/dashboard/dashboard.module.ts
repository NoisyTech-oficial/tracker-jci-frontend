import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { DashboardComponent } from './dashboard.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [WelcomeComponent, DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatIconModule
  ]
})
export class DashboardModule { }
