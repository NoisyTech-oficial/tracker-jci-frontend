import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { authGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      { path: 'inicio', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'funcionarios', loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule) },
      { path: 'obter-leads', loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule) },
      { path: 'conta', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
