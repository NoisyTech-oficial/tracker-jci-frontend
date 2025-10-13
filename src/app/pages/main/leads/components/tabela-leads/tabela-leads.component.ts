import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ObterLeads } from 'src/app/shared/interfaces/processes-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';

type SortDirection = 'asc' | 'desc';
type DensityMode = 'default' | 'compact';
type PeriodFilter = 'all' | '7d' | '30d';

interface StatusMeta {
  label: string;
  chipClass: string;
}

@Component({
  selector: 'app-tabela-leads',
  templateUrl: './tabela-leads.component.html',
  styleUrls: ['./tabela-leads.component.scss']
})
export class TabelaLeadsComponent {
  constructor(private masksService: MasksService) {}

  readonly pageSizeOptions = [25, 50, 100];
  pageSize = this.pageSizeOptions[0];
  currentPage = 1;

  density: DensityMode = 'default';

  allLeads: ObterLeads[] = [];
  leads: ObterLeads[] = [];
  paginatedProcesses: ObterLeads[] = [];

  searchTerm = '';
  selectedBanks = new Set<string>();
  selectedStatuses = new Set<string>();
  selectedPeriod: PeriodFilter = 'all';

  availableBanks: string[] = [];
  availableStatuses: string[] = [];

  sortColumn: keyof ObterLeads | '' = '';
  sortDirection: SortDirection = 'asc';

  readonly statusOptions = ['Cliente Encontrado', 'Cliente Desconhecido', 'Processo Desativado'];
  selectedStatus: Record<number, string> = {};

  readonly statusIdLabelMap: Record<number, string> = {
    1: 'Encontrado',
    2: 'Análise',
    3: 'Pendente',
    4: 'Problema'
  };

  readonly statusChipMap: Record<string, StatusMeta> = {
    encontrado: { label: 'Encontrado', chipClass: 'chip--ok' },
    'cliente encontrado': { label: 'Encontrado', chipClass: 'chip--ok' },
    analise: { label: 'Análise', chipClass: 'chip--warn' },
    análise: { label: 'Análise', chipClass: 'chip--warn' },
    'cliente desconhecido': { label: 'Análise', chipClass: 'chip--warn' },
    pendente: { label: 'Pendente', chipClass: 'chip--neu' },
    aguardando: { label: 'Pendente', chipClass: 'chip--neu' },
    'processo desativado': { label: 'Pendente', chipClass: 'chip--neu' },
    problema: { label: 'Problema', chipClass: 'chip--err' },
    erro: { label: 'Problema', chipClass: 'chip--err' }
  };

  @Input() isLoading = false;

  @Input() set leadsDados(data: ObterLeads[]) {
    this.allLeads = Array.isArray(data) ? [...data] : [];
    this.initialiseStatuses();
    this.buildFilterData();
    this.applyFiltersAndSort();
  }

  @Output() verDetalhesClicked = new EventEmitter<number>();
  @Output() statusChanged = new EventEmitter<{ status: string; processNumber: string | null | undefined }>();

  sortBy(column: keyof ObterLeads): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applyFiltersAndSort();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.updatePaginatedProcesses();
  }

  nextPage(): void {
    this.changePage(this.currentPage + 1);
  }

  prevPage(): void {
    this.changePage(this.currentPage - 1);
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  toggleBanco(banco: string): void {
    if (this.selectedBanks.has(banco)) {
      this.selectedBanks.delete(banco);
    } else {
      this.selectedBanks.add(banco);
    }
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  toggleStatusFilter(status: string): void {
    if (this.selectedStatuses.has(status)) {
      this.selectedStatuses.delete(status);
    } else {
      this.selectedStatuses.add(status);
    }
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  setPeriodFilter(period: PeriodFilter): void {
    this.selectedPeriod = period;
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedBanks.clear();
    this.selectedStatuses.clear();
    this.selectedPeriod = 'all';
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onDensityChange(mode: DensityMode): void {
    this.density = mode;
  }

  onPageSizeChange(size: number | string): void {
    const parsed = Number(size);
    if (!this.pageSizeOptions.includes(parsed)) return;
    this.pageSize = parsed;
    this.currentPage = 1;
    this.updatePaginatedProcesses();
  }

  verDetalhes(id: number): void {
    this.verDetalhesClicked.emit(id);
  }

  openRowAction(action: 'open' | 'details' | 'download' | 'archive', lead: ObterLeads): void {
    if (action === 'open' || action === 'details') {
      this.verDetalhes(lead.id);
      return;
    }

    if (action === 'download') {
      // placeholder: integrate download logic
      console.info('Baixar PDF ainda não implementado', lead);
    }

    if (action === 'archive') {
      // placeholder: integrate archive logic
      console.info('Arquivar ainda não implementado', lead);
    }
  }

  updateStatus(option: string, lead: ObterLeads): void {
    if (lead?.id) {
      this.selectedStatus[lead.id] = option;
    }
    this.statusChanged.emit({ status: option, processNumber: lead?.numero_processo });
    this.buildFilterData();
    this.applyFiltersAndSort();
  }

  getStatusMeta(lead: ObterLeads): StatusMeta {
    const raw = this.resolveStatusValue(lead);
    const key = raw.toLowerCase();
    return this.statusChipMap[key] ?? {
      label: raw,
      chipClass: 'chip--neu'
    };
  }

  getStatusLabel(lead: ObterLeads): string {
    return this.getStatusMeta(lead).label;
  }

  formatDocument(value: string | null | undefined): string | undefined {
    const format = this.masksService.formatDocument(value);
    return format ? format : undefined;
  }

  formatName(value: string | null | undefined): string | undefined {
    const formatted = this.masksService.formatName(value);
    return formatted && formatted.trim() ? formatted : undefined;
  }

  formatPhone(value: string | null | undefined): string | undefined {
    return this.masksService.formatPhone(value);
  }

  telHref(value: string | null | undefined): string | undefined {
    const digits = value ? value.replace(/\D+/g, '') : '';
    return digits ? `tel:${digits}` : undefined;
  }

  mailHref(value: string | null | undefined): string | undefined {
    return value ? `mailto:${value}` : undefined;
  }

  resolveOwner(value: unknown): string {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'string' && value.trim().length) return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'object') {
      const maybeName = (value as any)?.nome ?? (value as any)?.name ?? (value as any)?.label;
      if (typeof maybeName === 'string' && maybeName.trim().length) return maybeName;
      return JSON.stringify(value);
    }
    return String(value);
  }

  get resultRangeLabel(): string {
    if (!this.leads.length) return 'Nenhum processo';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.leads.length);
    return `Exibindo ${start}–${end} de ${this.leads.length} processos`;
  }

  get totalPages(): number {
    return this.leads.length ? Math.ceil(this.leads.length / this.pageSize) : 1;
  }

  get totalPagesArray(): number[] {
    const pages = this.totalPages;
    const blockSize = 7;
    const range: number[] = [];
    const half = Math.floor(blockSize / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(pages, start + blockSize - 1);
    if (end - start + 1 < blockSize) {
      start = Math.max(1, end - blockSize + 1);
    }
    for (let page = start; page <= end; page++) {
      range.push(page);
    }
    return range;
  }

  private initialiseStatuses(): void {
    this.selectedStatus = {};
    this.allLeads.forEach(lead => {
      if (!lead || typeof lead.id !== 'number') return;
      this.selectedStatus[lead.id] = this.resolveStatusValue(lead);
    });
  }

  private buildFilterData(): void {
    const bankSet = new Set<string>();
    const statusSet = new Set<string>();

    this.allLeads.forEach(lead => {
      if (lead?.banco) bankSet.add(lead.banco);
      statusSet.add(this.getStatusLabel(lead));
    });

    this.selectedBanks.forEach(b => {
      if (!bankSet.has(b)) this.selectedBanks.delete(b);
    });

    this.selectedStatuses.forEach(s => {
      if (!statusSet.has(s)) this.selectedStatuses.delete(s);
    });

    this.availableBanks = Array.from(bankSet).sort((a, b) => a.localeCompare(b));
    this.availableStatuses = Array.from(statusSet).sort((a, b) => a.localeCompare(b));
  }

  private applyFiltersAndSort(): void {
    const filtered = this.allLeads.filter(lead =>
      this.matchesSearch(lead) &&
      this.matchesBank(lead) &&
      this.matchesStatusFilter(lead) &&
      this.matchesPeriod(lead)
    );

    if (this.sortColumn) {
      filtered.sort((a, b) => this.compareValues(a, b, this.sortColumn as keyof ObterLeads));
    }

    this.leads = filtered;
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    if (this.currentPage < 1) this.currentPage = 1;
    this.updatePaginatedProcesses();
  }

  private matchesSearch(lead: ObterLeads): boolean {
    if (!this.searchTerm.trim()) return true;
    const term = this.searchTerm.trim().toLowerCase();
    const fields = [
      lead.numero_processo,
      lead.nome,
      lead.cpf,
      this.formatDocument(lead.cpf),
      this.resolveOwner(lead.pertence_a)
    ];
    return fields.some(field => (field ?? '').toString().toLowerCase().includes(term));
  }

  private matchesBank(lead: ObterLeads): boolean {
    if (!this.selectedBanks.size) return true;
    return lead?.banco ? this.selectedBanks.has(lead.banco) : false;
  }

  private matchesStatusFilter(lead: ObterLeads): boolean {
    if (!this.selectedStatuses.size) return true;
    return this.selectedStatuses.has(this.getStatusLabel(lead));
  }

  private matchesPeriod(lead: ObterLeads): boolean {
    if (this.selectedPeriod === 'all') return true;
    if (!lead?.createdAt) return false;
    const created = new Date(lead.createdAt);
    if (Number.isNaN(created.getTime())) return false;

    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (this.selectedPeriod === '7d') return diffDays <= 7;
    if (this.selectedPeriod === '30d') return diffDays <= 30;
    return true;
  }

  private compareValues(a: ObterLeads, b: ObterLeads, column: keyof ObterLeads): number {
    const valA = this.extractSortableValue(a, column);
    const valB = this.extractSortableValue(b, column);

    if (typeof valA === 'number' && typeof valB === 'number') {
      return this.sortDirection === 'asc' ? valA - valB : valB - valA;
    }

    return this.sortDirection === 'asc'
      ? String(valA ?? '').localeCompare(String(valB ?? ''))
      : String(valB ?? '').localeCompare(String(valA ?? ''));
  }

  private extractSortableValue(item: ObterLeads, column: keyof ObterLeads) {
    const value = item[column];
    if (column === 'createdAt') {
      return value ? new Date(value).getTime() : 0;
    }
    return value ?? '';
  }

  private updatePaginatedProcesses(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProcesses = this.leads.slice(start, end);
  }

  private resolveStatusValue(lead: ObterLeads): string {
    const explicit =
      (lead as any)?.status ??
      (lead as any)?.status_nome ??
      (lead as any)?.statusLabel ??
      this.selectedStatus?.[lead.id];

    if (typeof explicit === 'string' && explicit.trim()) {
      return explicit;
    }

    const statusId = (lead as any)?.status_id ?? lead?.status_id;
    if (typeof statusId === 'number') {
      return this.statusIdLabelMap[statusId] ?? String(statusId);
    }

    if (typeof explicit === 'number') {
      return String(explicit);
    }

    return this.statusOptions[0];
  }
}
