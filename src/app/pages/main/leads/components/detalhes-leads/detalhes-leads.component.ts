import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LeadDetailsService } from 'src/app/services/lead-details/lead-details.service';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { Header } from 'src/app/shared/interfaces/header.interface';
import { DetalhesLead, ObterLeads, ProcessDocumentStatus, ProcessoMovimentac } from 'src/app/shared/interfaces/processes-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';

type DocumentButtonState =
  | { visible: false }
  | {
      visible: true;
      action: 'request' | 'open' | 'disabled';
      label: string;
      styleClass: string;
      disabled: boolean;
      url?: string | null;
    };

@Component({
  selector: 'app-detalhes-leads',
  templateUrl: './detalhes-leads.component.html',
  styleUrls: ['./detalhes-leads.component.scss']
})
export class DetalhesLeadsComponent implements OnInit {
  header: Header = { title: 'Detalhes do Processo', subtitle: '' };
  fieldsLead: { label: string; value: string | null }[] = [];
  movimentacoes: ProcessoMovimentac[] = [];
  leadResumo: ObterLeads | null = null;
  activeTab: 'detalhes' | 'processo' = 'detalhes';
  isLoading = true;
  processLoading = false;
  processError: string | null = null;
  processDetails: DetalhesLead | null = null;
  documentStatus: ProcessDocumentStatus | null = null;
  documentStatusLoaded = false;
  documentRequestLoading = false;
  private leadId: string | null = null;

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
    if (this.leadResumo) {
      this.fieldsLead = this.mapLeadFields(this.leadResumo);
      this.isLoading = false;
    } else {
      this.loadLeadInfo(id);
    }
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

  selectTab(tab: 'detalhes' | 'processo'): void {
    this.activeTab = tab;
    if (tab === 'processo') {
      if (!this.processDetails) {
        this.loadProcessDetails();
      } else {
        this.loadDocumentStatus();
      }
    }
  }

  voltar(): void {
    this.router.navigate(['/obter-leads'], { relativeTo: this.route });
  }

  private loadProcessDetails(): void {
    if (!this.leadId) {
      return;
    }

    this.processLoading = true;
    this.processError = null;
    this.processDetails = null;
    this.movimentacoes = [];
    this.documentStatus = null;
    this.documentStatusLoaded = false;

    this.leadsService.getLeadProcess(this.leadId)
      .pipe(finalize(() => {
        this.processLoading = false;
      }))
      .subscribe({
        next: (res) => {
          this.processDetails = res;
          this.movimentacoes = res?.processo_movimentacoes || [];
          this.loadDocumentStatus();
        },
        error: () => {
          this.processError = 'Não foi possível carregar os dados do processo.';
          this.documentStatusLoaded = true;
        }
      });
  }

  private loadLeadInfo(id: string): void {
    this.isLoading = true;
    this.leadsService.getLeads()
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (leads) => {
          const lead = leads.find(item => String(item.id) === id);
          if (lead) {
            this.fieldsLead = this.mapLeadFields(lead);
          } else {
            this.fieldsLead = [];
          }
        },
        error: () => {
          this.fieldsLead = [];
        }
      });
  }

  private loadDocumentStatus(): void {
    if (!this.leadId) {
      return;
    }

    this.documentStatusLoaded = false;

    this.leadsService.getProcessDocumentsStatus(this.leadId)
      .pipe(finalize(() => {
        this.documentStatusLoaded = true;
      }))
      .subscribe({
        next: (response) => {
          const normalized = this.normalizeDocumentStatus(response);
          this.documentStatus = normalized;
        },
        error: () => {
          this.documentStatus = null;
        }
      });
  }

  requestDocuments(): void {
    if (!this.leadId || this.documentRequestLoading) {
      return;
    }

    this.documentRequestLoading = true;

    this.leadsService.requestProcessDocuments(this.leadId)
      .pipe(finalize(() => {
        this.documentRequestLoading = false;
      }))
      .subscribe({
        next: () => {
          this.documentStatus = { status: 'Solicitado' };
          this.loadDocumentStatus();
        },
        error: () => {
          this.documentStatusLoaded = true;
          this.loadDocumentStatus();
        }
      });
  }

  get documentButtonState(): DocumentButtonState {
    if (this.documentRequestLoading) {
      return {
        visible: true,
        action: 'request',
        label: 'Solicitando...',
        styleClass: 'docs-btn--request',
        disabled: true
      };
    }

    if (!this.documentStatusLoaded) {
      return { visible: false };
    }

    if (!this.documentStatus) {
      return {
        visible: true,
        action: 'request',
        label: 'Solicitar documentos',
        styleClass: 'docs-btn--request',
        disabled: false
      };
    }

    const status = this.getNormalizedStatus();
    const resolvedUrl = this.documentStatus?.url ?? this.documentStatus?.storagePath ?? null;
    const hasUrl = Boolean(resolvedUrl);

    if (hasUrl && this.isConcludedStatus(status)) {
      return {
        visible: true,
        action: 'open',
        label: 'Ver Processo',
        styleClass: 'docs-btn--available',
        disabled: false,
        url: resolvedUrl
      };
    }

    if (this.isUnavailableStatus(status) || (this.isConcludedStatus(status) && !hasUrl)) {
      return {
        visible: true,
        action: 'disabled',
        label: 'Processo não disponível',
        styleClass: 'docs-btn--unavailable',
        disabled: true
      };
    }

    return {
      visible: true,
      action: 'disabled',
      label: 'Aguardando a Conclusão',
      styleClass: 'docs-btn--pending',
      disabled: true
    };
  }

  private normalizeDocumentStatus(response: ProcessDocumentStatus | string | null | undefined): ProcessDocumentStatus | null {
    if (response === null || response === undefined) {
      return null;
    }

    let payload: any = response;

    if (typeof payload === 'object' && payload !== null && 'data' in payload) {
      const data = (payload as any).data;
      if (data !== null && data !== undefined) {
        payload = data;
      }
    }

    if (typeof payload === 'string') {
      const trimmed = payload.trim();
      if (!trimmed.length) {
        return null;
      }
      return { status: trimmed };
    }

    const rawStatus = payload?.status ?? payload?.situacao ?? payload?.state ?? null;
    const statusText = rawStatus !== null && rawStatus !== undefined ? String(rawStatus).trim() : '';
    const urlCandidate = payload?.url ?? payload?.link ?? payload?.rota ?? payload?.storagePath ?? payload?.path ?? null;

    if (!urlCandidate && !statusText) {
      return null;
    }

    return {
      status: (statusText || rawStatus) ?? null,
      url: urlCandidate ?? null,
      storagePath: payload?.storagePath ?? urlCandidate ?? null
    };
  }

  private getNormalizedStatus(): string {
    if (!this.documentStatus || this.documentStatus.status === null || this.documentStatus.status === undefined) {
      return '';
    }

    return String(this.documentStatus.status).trim().toLowerCase();
  }

  private isConcludedStatus(status: string): boolean {
    const concludedKeywords = ['conclu', 'finaliz', 'disponi', 'complet'];
    return concludedKeywords.some(keyword => status.includes(keyword));
  }

  private isUnavailableStatus(status: string): boolean {
    const unavailableKeywords = ['cancel', 'exclu', 'indispon'];
    return unavailableKeywords.some(keyword => status.includes(keyword));
  }

  openDocument(url?: string | null): void {
    if (!url) {
      return;
    }

    const trimmed = url.trim();
    if (!trimmed) {
      return;
    }

    const isAbsolute = /^https?:\/\//i.test(trimmed);
    const baseOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const target = isAbsolute
      ? trimmed
      : `${baseOrigin}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;

    if (typeof window !== 'undefined') {
      window.open(target, '_blank', 'noopener');
    }
  }
}
