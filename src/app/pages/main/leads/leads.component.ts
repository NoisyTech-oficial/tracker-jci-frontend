import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadDetailsService } from 'src/app/services/lead-details/lead-details.service';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { Header } from 'src/app/shared/interfaces/header.interface';
import { LeadSearchPayload, ObterLeads } from 'src/app/shared/interfaces/processes-data.interface';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit {
  isLoading: boolean = false;

  leads: ObterLeads[] = [];
  errorMessage: string | null = null;
  filtersForm!: FormGroup;

  header: Header = { title: 'Obter Processos', subtitle: 'Novos processos para sua empresa' };

  constructor(
    private processosService: ProcessesService,
    private roteador: Router,
    private rotaAtiva: ActivatedRoute,
    private leadDetailsService: LeadDetailsService,
    private formBuilder: FormBuilder
  ) {
    this.initialiseForm();
  }

  ngOnInit(): void {
    this.getLeads();  
  }

  getLeads(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.processosService.getLeads().subscribe({
      next: data => {
        this.isLoading = false;
        this.leads = data;
        this.sortLeads();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Não foi possível carregar os leads.';
      }
    });
  }

  sortLeads(): void {
    this.leads.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : Infinity;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : Infinity;
      return dateB - dateA;
    });
  }

  verDetalhes(id: number): void {
    const leadSelecionado = this.leads.find(lead => lead.id === id) || null;
    this.leadDetailsService.setLead(leadSelecionado);

    this.roteador.navigate(['detalhes', id], { relativeTo: this.rotaAtiva });
  }

  onStatusChanged(change: { status: string; processNumber: string | null | undefined }): void {
    // Integração com API pode ser adicionada aqui quando disponível.
  }

  applyFilters(): void {
    const payload = this.buildSearchPayload();
    const hasFilters = Boolean(payload.termoPesquisa) || Boolean(payload.filtros && Object.keys(payload.filtros).length);

    if (!hasFilters) {
      this.getLeads();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.processosService.searchLeads(payload).subscribe({
      next: data => {
        this.isLoading = false;
        this.leads = data;
        this.sortLeads();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Não foi possível aplicar os filtros.';
      }
    });
  }

  clearFilters(): void {
    this.filtersForm.reset({
      data_inicio: null,
      data_fim: null,
      termoPesquisa: ''
    });
    this.errorMessage = null;
    this.getLeads();
  }

  private initialiseForm(): void {
    this.filtersForm = this.formBuilder.group({
      data_inicio: [null],
      data_fim: [null],
      termoPesquisa: ['']
    });
  }

  private buildSearchPayload(): LeadSearchPayload {
    const { data_inicio, data_fim, termoPesquisa } = this.filtersForm.value;
    const trimmedTerm = (termoPesquisa ?? '').trim();

    const filtros: LeadSearchPayload['filtros'] = {};

    const inicioNormalizado = this.normaliseDate(data_inicio);
    if (inicioNormalizado) {
      filtros.data_inicio = inicioNormalizado;
    }

    const fimNormalizado = this.normaliseDate(data_fim);
    if (fimNormalizado) {
      filtros.data_fim = fimNormalizado;
    }

    const payload: LeadSearchPayload = {};

    if (Object.keys(filtros).length) {
      payload.filtros = filtros;
    }

    if (trimmedTerm) {
      payload.termoPesquisa = trimmedTerm;
    }

    return payload;
  }

  private normaliseDate(value: Date | string | null | undefined): string | undefined {
    if (!value) {
      return undefined;
    }

    if (value instanceof Date && !isNaN(value.getTime())) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    if (typeof value === 'string' && value.trim()) {
      return value;
    }

    return undefined;
  }
}
