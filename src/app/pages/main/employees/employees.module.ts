import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NewEmployeeModalComponent } from './components/new-employee-modal/new-employee-modal.component';
import { EditEmployeeModalComponent } from './components/edit-employee-modal/edit-employee-modal.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { DeleteEmployeeModalComponent } from './components/delete-employee-modal/delete-employee-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [EmployeesComponent, NewEmployeeModalComponent, EditEmployeeModalComponent, DeleteEmployeeModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    EmployeesRoutingModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    NgxMaskDirective,
    NgxMaskPipe,
    SharedModule
  ],
  providers: [provideNgxMask()]
})
export class EmployeesModule { }
