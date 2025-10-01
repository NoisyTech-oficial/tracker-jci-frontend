import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExportExcelService } from 'src/app/services/export-excel/export-excel.service';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { MasksService } from 'src/app/shared/masks/masks.service';
import { ProcessObtained, putStatusOrNotesProcess } from 'src/app/shared/interfaces/processes-obtained-data.interface';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Header } from 'src/app/shared/interfaces/header.interface';
import { ExportExcelComponent } from 'src/app/shared/components/export-excel/export-excel.component';

@Component({
  selector: 'app-processes-obtained',
  templateUrl: './processes-obtained.component.html',
  styleUrls: ['./processes-obtained.component.scss']
})
export class ProcessesObtainedComponent {
  isLoading: boolean = true;

  processesObtained: ProcessObtained[] = [];
  filteredProcesses: ProcessObtained[] = [];

  header: Header = { title: 'Meus Processos', subtitle: 'Acompanhe seus processos' };

  filtro = {
    dataInicio: '',
    horaInicio: '',
    dataFim: '',
    horaFim: ''
  };

  constructor(
    private exportExcelService: ExportExcelService,
    private processesService: ProcessesService,
    private masksService: MasksService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.getProcessesObtained();
  }

  exportData(filterPeriod: any) {
    const formattedData = this.processesObtained
      .filter(item => {
        if (!item.data_exporting) return false;
  
        const dataExporting = new Date(item.data_exporting);
  
        // Normalizando sem milissegundos pra evitar bugs
        const inicio = new Date(filterPeriod.dataInicio.setSeconds(0, 0));
        const fim = new Date(filterPeriod.dataFim.setSeconds(59, 999));
  
        return dataExporting >= inicio && dataExporting <= fim;
      })
      .map(item => ({
        "Número do processo": item.process_number || '-',
        "Nome do requerente": item.applicant_name || '-',
        "Valor do processo": this.formatCurrency(parseFloat(item.value!)) || '-',
        "Número do contrato": item.contract_number || '-',
        "Taxa do contrato": this.formatPercentage(item.contract_fee!) || '-',
        "Valor do juros do contrato": this.formatCurrency(item.contract_interest_rate!) || '-',
        "Valor das parcelas": this.formatCurrency(item.installment_amount!) || '-',
        "Parcelas pagas": item.paid_installments || '-',
        "Parcelas faltantes": item.remaining_installments || '-',
        "Parcelas em atraso": item.overdue_installments || '-',
        "Seguro prestamista": item.credit_life_insurance ? 'Sim' : 'Não',
  
        "Nome do cliente": item.company_name || '-',
        "Documento do cliente": this.formatDocument(item.cpf_cnpj!) || '-',
        "Telefone 1": this.formatPhone(item.phone1!) || '-',
        "Telefone 2": this.formatPhone(item.phone2!) || '-',
        "Cidade": item.cep!.city || '-',
        "Email": item.email || '-',
        "Endereço": item.address || '-',
  
        "Marca do veículo": item.vehicle_brand || '-',
        "Modelo do veículo": item.vehicle_model || '-',
        "Cor do veículo": item.vehicle_color || '-',
        "Ano do veículo": item.vehicle_year || '-',
        "Placa do veículo": this.formatPlateVehicle(item.vehicle_plate!) || '-',
        "Renavam do veículo": item.vehicle_renavam || '-',
      }));
  
    this.exportExcelService.exportToExcel(formattedData, `Processos`);
  }
  

  getProcessesObtained() {
    this.processesService.getProcessesObtained().subscribe({
      next: (response: ProcessObtained[]) => {
        this.isLoading = false;
        this.processesObtained = response;
        this.filteredProcesses = [...response];
        this.sortProcesses();

        const cities = this.getCitiesFromProcesses(response);
        // this.stateCity = cities;
        // this.filteredCities = [...cities];

        const banks = this.getBanksFromProcesses(response).map(name => ({ name, code: null }));
        // this.banks = banks;
        // this.filteredBanks = [...banks];
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.processesObtained = []; 
        } else {
          this.notificationService.showMessage('Erro ao obter os processos adquiridos, tente novamente.', 'error');
        }
      }
    });
  }

  sortProcesses() {
    this.filteredProcesses.sort((a, b) => {
      const dateA = a.distribution_date ? new Date(a.distribution_date).getTime() : Infinity;
      const dateB = b.distribution_date ? new Date(b.distribution_date).getTime() : Infinity;
      return dateB - dateA;
    });
  }

  postNewStatus(data: any) {
    const body: putStatusOrNotesProcess = {
      processNumber: data.process_number,
      status: data.permission,
    }

    this.processesService.putStatusOrNotesProcess(body).subscribe({
      error: () => {
        this.notificationService.showMessage('Erro ao atualizar o status do processo, tente novamente.', 'error');
      }
    });
  }

  showSpinner(): void {
    this.isLoading = true;
    this.spinner.show();
  }

  hideSpinner() {
    this.isLoading = false;
    this.spinner.hide();
  }

  exportExcel() {
    const dialogRef = this.dialog.open(ExportExcelComponent, {
      width: '450px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.exportData(result);
      }
    });
  }

  onSpace(event: any): void {
    event.stopPropagation(); // Impede que o mat-select feche ao apertar espaço
  }

  getCitiesFromProcesses(processes: ProcessObtained[]): string[] {
    const citiesSet = new Set<string>();

    processes.forEach(p => {
      if (p.cep!.city) {
        citiesSet.add(p.cep!.city);
      }
    });

    return Array.from(citiesSet).sort(); // ordena alfabeticamente
  }

  getBanksFromProcesses(processes: any[]): string[] {
    const bankSet = new Set<string>();

    processes.forEach(p => {
      if (p.applicant_name) {
        bankSet.add(p.applicant_name);
      }
    });

    return Array.from(bankSet).sort(); // Ordena os nomes
  }

  formatCurrency(value: number | undefined): string | undefined {
    const format = this.masksService.formatCurrency(value);
    return format ? format : undefined
  }

  formatPercentage(value: number | undefined): string | undefined {
    const format = this.masksService.formatPercentage(value);
    return format ? format : undefined
  }

  formatDocument(value: string | undefined): string | undefined {
    const format = this.masksService.formatDocument(value);
    return format ? format : undefined
  }

  formatPhone(value: string | undefined): string | undefined {
    const format = this.masksService.formatPhone(value);
    return format ? format : undefined
  }

  formatPlateVehicle(value: string | undefined): string | undefined {
    const format = this.masksService.formatPlateVehicle(value);
    return format ? format : undefined;
  }

  filterByProcessNumber(search: string) {
    this.filteredProcesses = search
      ? this.processesObtained.filter(proc =>
          proc.process_number.toLowerCase().includes(search)
        )
      : [...this.processesObtained];
  }
}
