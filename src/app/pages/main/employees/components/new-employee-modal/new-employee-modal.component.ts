import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesService } from 'src/app/services/employees/employees.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { EmployeesData } from 'src/app/shared/interfaces/employees-data.interface';
import { DocumentValidator } from 'src/app/shared/validators/document-length';

@Component({
  selector: 'app-new-employee-modal',
  templateUrl: './new-employee-modal.component.html',
  styleUrls: ['./new-employee-modal.component.scss']
})
export class NewEmployeeModalComponent implements OnInit {
  employeeForm!: FormGroup;
  permissions = ['Obter Processos', 'Funcionários'];
  isloading: boolean = false;

  hidePassword: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<NewEmployeeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeesData,
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.startForm();
  }

  startForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.minLength(6)],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      documento: ['', [Validators.required, DocumentValidator.validateDocumentLength]],
      permissao_visualizacao: [[], Validators.required]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.isloading = true;
    this.employeesService.postEmployee(this.employeeForm.value)
    .subscribe({
      next: () => {
        this.notificationService.showMessage('Funcionário adicionado com sucesso', 'success');
        this.dialogRef.close(this.employeeForm.value);
      },
      error: () => {
        this.isloading = false;
        this.notificationService.showMessage('Algo deu errado, tente novamente.', 'error');
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
