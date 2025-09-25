import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesService } from 'src/app/services/employees/employees.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { EmployeesData } from 'src/app/shared/interfaces/employees-data.interface';
import { PutEmployeeViewData } from 'src/app/shared/interfaces/put-employee-view-data';

@Component({
  selector: 'app-edit-employee-modal',
  templateUrl: './edit-employee-modal.component.html',
  styleUrls: ['./edit-employee-modal.component.scss']
})
export class EditEmployeeModalComponent implements OnInit {

  employeeForm!: FormGroup;
  documentEmployee: string = '';
  viewingPermission: string[] = [];

  permissions = ['Meus Processos', 'Obter Processos', 'Funcionários'];

  isloading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditEmployeeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeesData,
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private notificationService: NotificationService
  ) {
    this.documentEmployee = data.document;
    this.viewingPermission = data.viewing_permission;
  }

  ngOnInit(): void {
    this.startForm();
  }

  startForm(): void {
    this.employeeForm = this.fb.group({
      viewing_permission: [this.getSelectedPermissions(), Validators.required]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  editEmployee() {
    this.isloading = true;
    const data = this.getChangeViewingData(this.documentEmployee, (this.employeeForm.value).viewing_permission);

    this.employeesService.putEmployeeView(data)
    .subscribe({
      next: () => {
        this.notificationService.showMessage('Funcionário alterado com sucesso', 'success');
        this.dialogRef.close(
          {
            document: this.documentEmployee,
            viewing_permission: this.employeesService.rulesPermission((this.employeeForm.value).viewing_permission),
          }
        );
      },
      error: () => {
        this.isloading = false;
        this.notificationService.showMessage('Algo deu errado, tente novamente.', 'error');
      }
    });
  }

  getChangeViewingData(document: string, viewing: string[]): PutEmployeeViewData {
    return {
      viewing_permission: viewing,
      document: document
    };
  }

   getSelectedPermissions(): string[] {
    return this.permissions.filter(option =>
      this.viewingPermission.some(perm => this.normalizeText(option) === perm)
    );
  }

  normalizeText(text: string): string {
    return text
      .normalize("NFD") // Remove acentos
      .replace(/[\u0300-\u036f]/g, "") // Remove caracteres especiais
      .toUpperCase() // Converte para maiúsculas
      .replace(/\s+/g, "_"); // Substitui espaços por underline, se necessário
  }

}
