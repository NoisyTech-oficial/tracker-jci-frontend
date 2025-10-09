import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ExportExcelService } from '../../../services/export-excel/export-excel.service';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ObterLeads } from 'src/app/shared/interfaces/processes-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';
import { Header } from 'src/app/shared/interfaces/header.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadDetailsService } from 'src/app/services/lead-details/lead-details.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit {
  isLoading: boolean = false;
  resetFilter: boolean = false;

  filterForm!: FormGroup;

  leads: ObterLeads[] = [];

  header: Header = { title: 'Obter Processos', subtitle: 'Novos processos para sua empresa' };

  constructor(
    private exportExcelService: ExportExcelService,
    private processosService: ProcessesService,
    private masksService: MasksService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private roteador: Router,
    private rotaAtiva: ActivatedRoute,
    private leadDetailsService: LeadDetailsService
  ) {
  }

  ngOnInit(): void {
    this.getLeads();  
  }

  resetFilters() {
    this.resetFilter = true;
  }

  getTotalNumberProcesses() {
    this.isLoading = true;
    const hasFilters = this.hasFilterApplied();

    const body = this.getBodyProcesses(hasFilters);

    // this.processosService.getTotalNumberProcesses(body).subscribe(data => {
    //   this.isLoading = false;
    //   this.confirmGetProcesses(data.total, body);
    // });
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

  getLeads() {
    this.isLoading = true;
    this.processosService.getLeads().subscribe(data => {
      this.isLoading = false;
      this.leads = data;
      this.sortLeads();
    });
  }

  getProcesses(body: any) {
    // this.isLoading = true;
    // this.processosService.getProcesses(body).subscribe(data => {
    //   this.isLoading = false;
    //   this.processesObtained = data.data;
    //   this.sortLeads();
    // });
  }

  sortLeads() {
    this.leads.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : Infinity;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : Infinity;
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

  verDetalhes(id: number) {
    const leadSelecionado = this.leads.find(lead => lead.id === id) || null;
    this.leadDetailsService.setLead(leadSelecionado);

    this.roteador.navigate(['detalhes', id], { relativeTo: this.rotaAtiva });
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
