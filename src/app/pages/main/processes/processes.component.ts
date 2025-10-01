import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ExportExcelService } from '../../../services/export-excel/export-excel.service';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmGetProcessesModalComponent } from './components/confirm-get-processes-modal/confirm-get-processes-modal.component';
import { Process } from 'src/app/shared/interfaces/processes-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';
import { Header } from 'src/app/shared/interfaces/header.interface';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.scss']
})
export class ProcessesComponent {
  isLoading: boolean = false;
  resetFilter: boolean = false;

  filterForm!: FormGroup;

  processesObtained: Process[] = [];

  header: Header = { title: 'Obter Processos', subtitle: 'Novos processos para sua empresa' };

  constructor(
    private exportExcelService: ExportExcelService,
    private processesService: ProcessesService,
    private masksService: MasksService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
  ) {
  }

  exportData() {
    const formattedData = this.processesObtained.map(item => ({
      "Número do processo": item.process_number || '-',
      "Nome do requerente": item.applicant_name || '-',
      "Valor do processo": item.value ? this.formatCurrency(parseFloat(item.value)) : '-',
      "Número do contrato": item.contract_number || '-',
      "Taxa do contrato": item.contract_fee ? this.formatPercentage(item.contract_fee) : '-',
      "Valor do juros do contrato": item.contract_interest_rate ? this.formatCurrency(item.contract_interest_rate) : '-',
      "Valor das parcelas": this.formatCurrency(item.installment_amount!) || '-',
      "Parcelas pagas": item.paid_installments || '-',
      "Parcelas faltantes": item.remaining_installments || '-',
      "Parcelas em atraso": item.overdue_installments || '-',
      "Seguro prestamista": item.credit_life_insurance ? 'Sim' : 'Não',

      "Nome do requerido": item.company_name || '-',
      "Documento do requerido": item.cpf_cnpj ? this.formatDocument(item.cpf_cnpj) : '-',
      "Telefone 1": item.phone1 ? this.formatPhone(item.phone1) : '-',
      "Telefone 2": item.phone2 ? this.formatPhone(item.phone2) : '-',
      "Cidade": item.cep ? item.cep.city : '-',
      "Email": item.email || '-',
      "Endereço": item.address || '-',

      "Marca do veículo": item.vehicle_brand || '-',
      "Modelo do veículo": item.vehicle_model || '-',
      "Cor do veículo": item.vehicle_color || '-',
      "Ano do veículo": item.vehicle_year || '-',
      "Placa do veículo": item.vehicle_plate ? this.formatPlateVehicle(item.vehicle_plate) : '-',
      "Renavam do veículo": item.vehicle_renavam || '-',
    }));

    this.exportExcelService.exportToExcel(formattedData, `Processos`);
  }

  newSearch() {
    this.resetFilters();
    this.isLoading = false;
    this.processesObtained = [];
  }

  resetFilters() {
    this.resetFilter = true;
  }

  getTotalNumberProcesses() {
    this.isLoading = true;
    const hasFilters = this.hasFilterApplied();

    const body = this.getBodyProcesses(hasFilters);

    this.processesService.getTotalNumberProcesses(body).subscribe(data => {
      this.isLoading = false;
      this.confirmGetProcesses(data.total, body);
    });
  }

  hasFilterApplied(): boolean {
    const formValues = this.filterForm?.value;

    if (formValues) {
      const hasFilters = Object.values(formValues).some(value => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== null && value !== '';
      });
  
      return hasFilters;
    }

    return false;
  }

  setFormValues(form: FormGroup) {
    this.filterForm = form;
  }

  getBodyProcesses(hasFilters: boolean): any {
    if(this.filterForm?.value) {
      const formValues = this.filterForm.value;
      if (!hasFilters) return null;

      return {
        banks: formValues.bank.map((b: any) => b.name),
        minimum_value: formValues.minValue ?? null,
        maximum_value: formValues.maxValue ?? null,
        city: formValues.city.length > 0 ? formValues.city : [],
        state: formValues.state.length > 0 ? formValues.state : []
      };
    }
  }

  confirmGetProcesses(qtdProcesses: number, body: any) {
    const dialogRef = this.dialog.open(ConfirmGetProcessesModalComponent, {
      width: '500px',
      data: qtdProcesses
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProcesses(body);
        console.log('Buscando Processos...');
      }
    });
  }

  getProcesses(body: any) {
    this.isLoading = true;
    this.processesService.getProcesses(body).subscribe(data => {
      this.isLoading = false;
      this.processesObtained = data.data;
      this.sortProcesses();
    });
  }

  sortProcesses() {
    this.processesObtained.sort((a, b) => {
      const dateA = a.distribution_date ? new Date(a.distribution_date).getTime() : Infinity;
      const dateB = b.distribution_date ? new Date(b.distribution_date).getTime() : Infinity;
      return dateB - dateA;
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

  seeMore(index: number) {
    // this.dialog.open(SeeMoreInformationsProcessesModalComponent, {
    //   width: '800px',
    //   data: this.processesObtained[index]
    // });
  }

  onSpace(event: any): void {
    event.stopPropagation();
  }

  formatCurrency(value: number | undefined): string | null {
    const format = this.masksService.formatCurrency(value);
    return format ? format : null
  }

  formatPercentage(value: number | undefined): string | null {
    const format = this.masksService.formatPercentage(value);
    return format ? format : null
  }

  formatDocument(value: string | undefined): string | null {
    const format = this.masksService.formatDocument(value);
    return format ? format : null
  }

  formatPhone(value: string | undefined): string | null {
    const format = this.masksService.formatPhone(value);
    return format ? format : null
  }

  formatPlateVehicle(value: string | undefined): string | null {
    const format = this.masksService.formatPlateVehicle(value);
    return format ? format : null;
  }

  getElapsedTimeMask(date: string | Date): string {
    return this.masksService.getElapsedTimeMask(date);
  }

  get searchButtonText(): string {
    const hasFilters = this.hasFilterApplied();
    return hasFilters ? 'Buscar com filtro' : 'Buscar sem filtro';
  }
}
