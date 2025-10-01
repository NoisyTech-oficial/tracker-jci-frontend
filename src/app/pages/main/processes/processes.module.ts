import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessesComponent } from './processes.component';
import { ProcessesRoutingModule } from './processes-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ConfirmGetProcessesModalComponent } from './components/confirm-get-processes-modal/confirm-get-processes-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersProcessesComponent } from './components/filters-processes/filters-processes.component';
import { TableProcessesComponent } from './components/table-processes/table-processes.component';

@NgModule({
  declarations: [ProcessesComponent, ConfirmGetProcessesModalComponent, FiltersProcessesComponent, TableProcessesComponent],
  imports: [
    CommonModule,
    ProcessesRoutingModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    SharedModule
  ],
  providers: [provideNgxMask()],
  exports: []
})
export class ProcessesModule { }
