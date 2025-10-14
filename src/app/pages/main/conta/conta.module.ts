import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './conta-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ContaComponent } from './conta.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ConfiguracoesComponent } from './components/configuracoes/configuracoes.component';
import { StatusManagerComponent } from './components/status-manager/status-manager.component';
import { StatusDialogComponent } from './components/status-manager/status-dialog/status-dialog.component';
import { StatusConfirmDialogComponent } from './components/status-manager/status-confirm-dialog/status-confirm-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // se for usar a barra de progresso futuramente
import { ConfirmAvatarDialogComponent } from './components/perfil/confirm-avatar-dialog/confirm-avatar-dialog.component';

@NgModule({
  declarations: [
    ContaComponent,
    PerfilComponent,
    ConfiguracoesComponent,
    StatusManagerComponent,
    StatusDialogComponent,
    StatusConfirmDialogComponent,
    ConfirmAvatarDialogComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    SharedModule,
    MatCardModule,
    MatProgressBarModule
  ]
})
export class ContaModule { }
