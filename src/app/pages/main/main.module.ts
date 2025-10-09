import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FirstAccessComponent } from './components/first-access/first-access.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatButtonModule } from '@angular/material/button';
import { UserDisabledComponent } from './components/user-disabled/user-disabled.component';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [MainComponent, FirstAccessComponent, UserDisabledComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxSpinnerModule,
    SharedModule,
    NgChartsModule,
  ]
})
export class MainModule { }
