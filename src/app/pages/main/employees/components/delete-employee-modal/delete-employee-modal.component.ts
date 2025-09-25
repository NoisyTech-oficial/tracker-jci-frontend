import { NotificationService } from 'src/app/services/notification/notification.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesService } from 'src/app/services/employees/employees.service';
import { EmployeesData } from 'src/app/shared/interfaces/employees-data.interface';

@Component({
  selector: 'app-delete-employee-modal',
  templateUrl: './delete-employee-modal.component.html',
  styleUrls: ['./delete-employee-modal.component.scss']
})
export class DeleteEmployeeModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteEmployeeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeesData,
    private employeesService: EmployeesService,
    private notificationService: NotificationService
  ) {}

  isloading: boolean = false;

  close(): void {
    this.dialogRef.close();
  }

  deleteEmployee() {
    this.isloading = true;
    this.employeesService.deleteEmployee(this.data.document).subscribe({
      next: () => {
        this.notificationService.showMessage('Funcionário excluído com sucesso', 'success');
        this.dialogRef.close(this.data.document);
      },
      error: () => {
        this.isloading = false;
        this.notificationService.showMessage('Erro ao excluir funcionário, tente novamente.', 'error');
      }
    });
  }
}
