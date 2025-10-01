import { EmployeesService } from './../../../services/employees/employees.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeesData } from 'src/app/shared/interfaces/employees-data.interface';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { NewEmployeeModalComponent } from './components/new-employee-modal/new-employee-modal.component';
import { EditEmployeeModalComponent } from './components/edit-employee-modal/edit-employee-modal.component';
import { DeleteEmployeeModalComponent } from './components/delete-employee-modal/delete-employee-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user/user.service';
import { UserData } from 'src/app/shared/interfaces/user-data.interface';
import { Header } from 'src/app/shared/interfaces/header.interface';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private employeesService: EmployeesService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  
  employeesData: EmployeesData[] = [];
  filteredEmployees = [...this.employeesData];

  userData!: UserData;
  isLoading: boolean = false;

  header: Header = { title: 'Funcionários', subtitle: 'Gerencie os funcionários da sua empresa' };

  ngOnInit(): void {
    this.getEmployees();
    this.getUserData();
  }

  sortViewingPermission() {
    this.employeesData.map(item => item.permissao_visualizacao.sort());
  }

  getEmployees() {
    this.isLoading = true;
    this.employeesService.getEmployees().subscribe({
      next: (response: EmployeesData[]) => {
        this.employeesData = response;
        this.filteredEmployees = [...this.employeesData];
        this.sortViewingPermission();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.showMessage('Erro ao obter funcionários, tente novamente.', 'error');
      }
    });
  }

  getUserData() {
    this.userData = this.userService.getUserData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredEmployees = this.employeesData.filter(emp =>
      (emp.nome!.toLowerCase()).includes(filterValue)
    );
  }

  openNewEmployeeModal(employee?: EmployeesData): void {
    const dialogRef = this.dialog.open(NewEmployeeModalComponent, {
      width: '600px',
      data: employee
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeesData.push({
          nome: null,
          documento: result.documento,
          permissao_visualizacao: result.permissao_visualizacao
        });

        this.filteredEmployees = [...this.employeesData];
      }
    });
  }

  getFirstAndLastName(fullName: string): string {
    if (!fullName) return '';

    const names = fullName.trim().split(/\s+/);
    if (names.length === 1) return names[0];

    return `${names[0]} ${names[names.length - 1]}`;
  }

  editEmployee(employee: EmployeesData) {
    const dialogRef = this.dialog.open(EditEmployeeModalComponent, {
      width: '600px',
      data: employee
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeesData.map(item => {
          if (item.documento === result.documento) {
            item.permissao_visualizacao = result.permissao_visualizacao;
          }
        });
        this.filteredEmployees = [...this.employeesData];
      }
    });
  }

  deleteEmployee(name: string, documento: string) {
    const dialogRef = this.dialog.open(DeleteEmployeeModalComponent, {
      width: '600px',
      data: { name: name, documento: documento }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeesData = this.employeesData.filter(employee => employee.documento !== result);
        this.filteredEmployees = [...this.employeesData];
      }
    });
  }

  formatMenuTitle(value: string): string {
    return value
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  } 
  
}
