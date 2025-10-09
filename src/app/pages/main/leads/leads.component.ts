import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadDetailsService } from 'src/app/services/lead-details/lead-details.service';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { Header } from 'src/app/shared/interfaces/header.interface';
import { ObterLeads } from 'src/app/shared/interfaces/processes-data.interface';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit {
  isLoading: boolean = false;

  leads: ObterLeads[] = [];

  header: Header = { title: 'Obter Processos', subtitle: 'Novos processos para sua empresa' };

  constructor(
    private processosService: ProcessesService,
    private roteador: Router,
    private rotaAtiva: ActivatedRoute,
    private leadDetailsService: LeadDetailsService
  ) {
  }

  ngOnInit(): void {
    this.getLeads();  
  }

  getLeads() {
    this.isLoading = true;
    this.processosService.getLeads().subscribe(data => {
      this.isLoading = false;
      this.leads = data;
      this.sortLeads();
    });
  }

  sortLeads() {
    this.leads.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : Infinity;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : Infinity;
      return dateB - dateA;
    });
  }

  verDetalhes(id: number) {
    const leadSelecionado = this.leads.find(lead => lead.id === id) || null;
    this.leadDetailsService.setLead(leadSelecionado);

    this.roteador.navigate(['detalhes', id], { relativeTo: this.rotaAtiva });
  }

  onStatusChanged(change: { status: string; processNumber: string | null | undefined }): void {
    // Integração com API pode ser adicionada aqui quando disponível.
  }
}
