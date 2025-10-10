import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { ConfiguracoesComponent } from './components/configuracoes/configuracoes.component';
import { ContaComponent } from './conta.component';
import { PerfilComponent } from './components/perfil/perfil.component';

const routes: Routes = [
  {
    path: '',
    component: ContaComponent,
    canActivate: [authGuard]
  },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
