import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LeadDetailsService } from 'src/app/services/lead-details/lead-details.service';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { Header } from 'src/app/shared/interfaces/header.interface';
import { DetalhesLead, ObterLeads, ProcessoDocumento, ProcessoMovimentac } from 'src/app/shared/interfaces/processes-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';

@Component({
  selector: 'app-detalhes-leads',
  templateUrl: './detalhes-leads.component.html',
  styleUrls: ['./detalhes-leads.component.scss']
})
export class DetalhesLeadsComponent implements OnInit {
  header: Header = { title: 'Detalhes do Processo', subtitle: '' };
  fieldsLead: { label: string; value: string | null }[] = [];
  fieldsProcess: { label: string; value: string | null }[] = [];
  movimentacoes: ProcessoMovimentac[] = [];
  documentos: ProcessoDocumento[] = [];
  detalhes: DetalhesLead | null = null;
  leadResumo: ObterLeads | null = null;
  activeTab: 'detalhes' | 'movimentacoes' | 'documentos' = 'detalhes';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadsService: ProcessesService,
    private masksService: MasksService,
    private leadDetailsService: LeadDetailsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.leadResumo = this.leadDetailsService.getLead();
    if (this.leadResumo) {
      this.fieldsLead = this.mapLeadFields(this.leadResumo);
    }

    this.leadsService.getDetalhesLeads(id)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((res) => {
        this.detalhes = res;
        this.fieldsProcess = this.mapProcessFields(res);
        this.movimentacoes = res?.processo_movimentacoes || [];
        this.documentos = res?.processo_documentos || [];
        this.leadDetailsService.clear();
      });
  }

  formatCurrency(value: string | null): string | null {
    if (!value) return null;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return value;
    return this.masksService.formatCurrency(parsed) ?? value;
  }

  formatDate(value: string | null): string | null {
    if (!value) return null;
    return this.masksService.getFormatDateToLabel(value);
  }

  formatDocument(value: string | null): string | null {
    if (!value) return null;
    return this.masksService.formatDocument(value) ?? value;
  }

  formatPhone(value: string | null): string | null {
    if (!value) return null;
    return this.masksService.formatPhone(value) ?? value;
  }

  private mapProcessFields(res: DetalhesLead): { label: string; value: string | null }[] {
    return [
      { label: 'Assunto', value: res.processo_assunto || null },
      { label: 'Classe', value: res.processo_classe || null },
      { label: 'Foro', value: res.processo_foro || null },
      { label: 'Vara', value: res.processo_vara || null },
      { label: 'Juiz', value: res.processo_juiz || null },
      { label: 'Distribuição', value: this.formatDate(res.processo_distribuicao) },
      { label: 'Valor da Ação', value: this.formatCurrency(res.processo_valor_acao) },
      { label: 'Requerente', value: res.processo_requerente || null },
      { label: 'Advogado do Requerente', value: res.processo_advogado_requerente || null }
    ];
  }

  private mapLeadFields(lead: ObterLeads): { label: string; value: string | null }[] {
    return [
      { label: 'Nome', value: lead.nome || null },
      { label: 'CPF', value: this.formatDocument(lead.cpf) },
      { label: 'Número do Processo', value: lead.numero_processo || null },
      { label: 'Telefone 1', value: this.formatPhone(lead.telefone_1) },
      { label: 'Telefone 2', value: this.formatPhone(lead.telefone_2) },
      { label: 'E-mail', value: lead.email || null },
      { label: 'Banco', value: lead.banco || null },
      { label: 'Status', value: lead.status_id !== undefined && lead.status_id !== null ? String(lead.status_id) : null },
      { label: 'Responsável', value: lead.owner?.nome || (lead.pertence_a !== undefined && lead.pertence_a !== null ? String(lead.pertence_a) : null) },
      { label: 'Criado em', value: this.formatDate(lead.createdAt) }
    ];
  }

  formatMovementDate(date: string): string {
    return this.formatDate(date) || '-';
  }

  selectTab(tab: 'detalhes' | 'movimentacoes' | 'documentos'): void {
    this.activeTab = tab;
  }

  voltar(): void {
    this.router.navigate(['/obter-processos'], { relativeTo: this.route });
  }
}
