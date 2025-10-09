import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  
import { RouterModule, Routes } from '@angular/router';

import { NgChartsModule } from 'ng2-charts';
import { DashboardPage } from './dashboard.page';

const routes: Routes = [{ path: '', component: DashboardPage }];

@NgModule({
  declarations: [DashboardPage],
  imports: [
    CommonModule,
    FormsModule,         
    NgChartsModule,
    RouterModule.forChild(routes),
  ],
})
export class DashboardModule {}
