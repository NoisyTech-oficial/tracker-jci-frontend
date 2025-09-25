import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SettingsComponent } from './settings.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { MyPlanComponent } from './components/my-plan/my-plan.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // se for usar a barra de progresso futuramente

@NgModule({
  declarations: [SettingsComponent, MyAccountComponent, MyPlanComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    FormsModule,
    SharedModule,
    MatCardModule,
    MatProgressBarModule
  ]
})
export class SettingsModule { }
