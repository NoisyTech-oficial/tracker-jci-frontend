import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { ProcessesObtainedComponent } from './processes-obtained.component';

const routes: Routes = [
  { path: '', component: ProcessesObtainedComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessesObtainedRoutingModule { }
