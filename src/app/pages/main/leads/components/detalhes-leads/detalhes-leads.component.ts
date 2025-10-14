import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LeadDetailsService } from 'src/app/services/lead-details/lead-details.service';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { Header } from 'src/app/shared/interfaces/header.interface';
import { DetalhesLead, LeadProcessDetails, ObterLeads, ProcessoDocumento, ProcessoMovimentac } from 'src/app/shared/interfaces/processes-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';

@Component({
  selector: 'app-detalhes-leads',
  templateUrl: './detalhes-leads.component.html',
  styleUrls: ['./detalhes-leads.component.scss']
})
export class DetalhesLeadsComponent implements OnInit, OnDestroy {
  header: Header = { title: 'Detalhes do Processo', subtitle: '' };
  fieldsLead: { label: string; value: string | null }[] = [];
  documentos: ProcessoDocumento[] = [];
  detalhes: DetalhesLead | null = null;
  leadResumo: ObterLeads | null = null;
  leadProcessDetails: LeadProcessDetails | null = null;
  processMovements: ProcessoMovimentac[] = [];
  activeTab: 'detalhes' | 'processo' | 'documentos' = 'detalhes';
  isLoading = true;
  isProcessDetailsLoading = false;
  isLeadInfoLoading = false;
  private leadId: string | null = null;
  private hasLoadedProcessDetails = false;
  private mergedLeadData: Partial<ObterLeads> & { owner?: ObterLeads['owner'] | null } = {};

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

    this.leadId = id;
    this.leadResumo = this.leadDetailsService.getLead();

    if (!this.leadResumo) {
      this.isLeadInfoLoading = true;
      this.carregarDetalhesProcesso(id);
    } else {
      this.mergeLeadData(this.leadResumo);
    }

    this.leadsService.getDetalhesLeads(id)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((res) => {
        this.detalhes = res;
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

  formatDate(value: string | null | undefined): string | null {
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

  formatMovementDate(date: string | null | undefined): string {
    return this.formatDate(date ?? null) || '-';
  }

  ngOnDestroy(): void {
    this.hasLoadedProcessDetails = false;
    this.leadProcessDetails = null;
  }

  selectTab(tab: 'detalhes' | 'processo' | 'documentos'): void {
    this.activeTab = tab;
    if (tab === 'processo' && this.leadId && !this.hasLoadedProcessDetails && !this.isProcessDetailsLoading) {
      this.carregarDetalhesProcesso(this.leadId);
    }
  }

  voltar(): void {
    this.router.navigate(['/obter-processos'], { relativeTo: this.route });
  }

  solicitarDocumentos(): void {
    // Implementação futura
  }

  private carregarDetalhesProcesso(id: string): void {
    this.isProcessDetailsLoading = true;
    this.leadsService.getLeadProcessDetails(id)
      .pipe(finalize(() => {
        this.isProcessDetailsLoading = false;
      }))
      .subscribe({
        next: (detalhesProcesso) => {
          this.leadProcessDetails = detalhesProcesso;
          this.processMovements = detalhesProcesso?.processo_movimentacoes || [];
          this.mergeLeadData(detalhesProcesso);
          this.hasLoadedProcessDetails = true;
          this.isLeadInfoLoading = false;
        },
        error: () => {
          this.leadProcessDetails = null;
          this.processMovements = [];
          this.populateLeadFields();
          this.hasLoadedProcessDetails = false;
          this.isLeadInfoLoading = false;
        }
      });
  }

  private mergeLeadData(source: Partial<LeadProcessDetails> | Partial<ObterLeads> | null | undefined): void {
    if (!source) {
      this.populateLeadFields();
      return;
    }

    const map: Record<string, any> = {
      nome: (source as any).nome,
      cpf: (source as any).cpf,
      numero_processo: (source as any).numero_processo,
      telefone_1: (source as any).telefone_1,
      telefone_2: (source as any).telefone_2,
      email: (source as any).email,
      banco: (source as any).banco,
      status_id: (source as any).status_id,
      pertence_a: (source as any).pertence_a,
      createdAt: (source as any).createdAt
    };

    let changed = false;

    Object.entries(map).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if ((this.mergedLeadData as any)[key] !== value) {
          (this.mergedLeadData as any)[key] = value;
          changed = true;
        }
      }
    });

    if ('owner' in (source as any)) {
      this.mergedLeadData.owner = (source as any).owner ?? null;
      changed = true;
    }

    if (changed || !this.fieldsLead.length) {
      this.populateLeadFields();
    }
  }

  private populateLeadFields(): void {
    const data = this.mergedLeadData;

    const telefone1 = data.telefone_1 ?? null;
    const telefone2 = data.telefone_2 ?? null;
    const status = data.status_id ?? null;
    const pertenceA = data.pertence_a ?? null;
    const createdAt = data.createdAt ?? null;
    const ownerName = data.owner?.nome ?? null;
    const responsibleValue = ownerName ?? (pertenceA !== null && pertenceA !== undefined ? `ID ${pertenceA}` : null);

    const fields = [
      { label: 'Nome', value: data.nome ?? null },
      { label: 'CPF', value: this.formatDocument((data.cpf ?? null) as string | null) },
      { label: 'Número do Processo', value: data.numero_processo ?? null },
      { label: 'Telefone 1', value: telefone1 ? this.formatPhone(telefone1) : null },
      { label: 'Telefone 2', value: telefone2 ? this.formatPhone(telefone2) : null },
      { label: 'E-mail', value: data.email ?? null },
      { label: 'Banco', value: data.banco ?? null },
      { label: 'Responsável', value: responsibleValue },
      { label: 'Status', value: status !== null && status !== undefined ? String(status) : null },
      { label: 'Pertence a', value: pertenceA !== null && pertenceA !== undefined ? String(pertenceA) : null },
      { label: 'Criado em', value: this.formatDate(createdAt ?? null) }
    ];

    const hasData = fields.some(field => field.value !== null && field.value !== undefined && field.value !== '');
    this.fieldsLead = hasData ? fields : [];
  }
}
