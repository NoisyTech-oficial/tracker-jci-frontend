import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { LeadsComponent } from './leads.component';
import { DetalhesLeadsComponent } from './components/detalhes-leads/detalhes-leads.component';

const routes: Routes = [
  { path: '', component: LeadsComponent, canActivate: [authGuard] },
  { path: 'detalhes/:id', component: DetalhesLeadsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessesRoutingModule { }
