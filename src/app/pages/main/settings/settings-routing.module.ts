import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { SettingsComponent } from './settings.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { MyPlanComponent } from './components/my-plan/my-plan.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    canActivate: [authGuard]
  },
  { path: 'perfil', component: MyAccountComponent, canActivate: [authGuard] },
  { path: 'plano', component: MyPlanComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
