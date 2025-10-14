import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ObterLeads } from 'src/app/shared/interfaces/processes-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';
import { environment } from 'src/environments/environment.prod';

type SortDirection = 'asc' | 'desc';
type DensityMode = 'default' | 'compact';

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

  readonly permissions = ['Cliente Encontrado', 'Cliente Desconhecido', 'Processo Desativado'];
  selectedStatus: Record<number, string> = {};
  imageLoadError: Record<number, boolean> = {};

  sortColumn: keyof ObterLeads | '' = '';
  sortDirection: SortDirection = 'asc';

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

  @Input() set leadsDados(data: ObterLeads[]) {
    this.imageLoadError = {};
    this.allLeads = (data || []).map(lead => ({
      ...lead,
      owner: lead.owner ? { ...lead.owner, image: this.resolveOwnerImage(lead.owner.image) } : null
    }));

    this.initialiseStatuses();
    this.applySorting();
    this.currentPage = 1;
    this.updatePaginatedProcesses();
  }

  @Input() isLoading: boolean = false;

  @Output() verDetalhesClicked = new EventEmitter<number>();
  @Output() statusChanged = new EventEmitter<{ status: string; processNumber: string | null | undefined }>();

  sortBy(column: keyof ObterLeads): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applySorting();
    this.currentPage = 1;
    this.updatePaginatedProcesses();
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

  onImageError(leadId: number): void {
    this.imageLoadError[leadId] = true;
  }

  updateStatus(option: string, lead: ObterLeads): void {
    if (lead?.id) {
      this.selectedStatus[lead.id] = option;
    }
    this.statusChanged.emit({ status: option, processNumber: lead?.numero_processo });
    this.applySorting();
    this.updatePaginatedProcesses();
  }

  getStatusMeta(lead: ObterLeads): StatusMeta {
    const raw = this.resolveStatusValue(lead);
    const key = raw.toLowerCase();
    return this.statusChipMap[key] ?? { label: raw, chipClass: 'chip--neu' };
  }

  getStatusLabel(lead: ObterLeads): string {
    return this.getStatusMeta(lead).label;
  }

  formatDocument(value: string | null | undefined): string | undefined {
    const formatted = this.masksService.formatDocument(value);
    return formatted || undefined;
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

  get totalPages(): number {
    return Math.ceil(this.leads.length / this.pageSize) || 1;
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

  get resultRangeLabel(): string {
    if (!this.leads.length) return 'Nenhum processo';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.leads.length);
    return `Exibindo ${start}–${end} de ${this.leads.length} processos`;
  }

  private initialiseStatuses(): void {
    this.selectedStatus = {};
    this.allLeads.forEach(lead => {
      if (!lead || typeof lead.id !== 'number') return;
      this.selectedStatus[lead.id] = this.resolveStatusValue(lead);
    });
  }

  private applySorting(): void {
    const data = [...this.allLeads];
    if (this.sortColumn) {
      data.sort((a, b) => this.compareValues(a, b, this.sortColumn as keyof ObterLeads));
    }
    this.leads = data;
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
    if (column === 'createdAt') {
      const dateValue = item.createdAt;
      return dateValue ? new Date(dateValue).getTime() : 0;
    }
    if (column === 'pertence_a') {
      return item.pertence_a ?? 0;
    }
    if (column === 'owner') {
      return item.owner?.nome ?? '';
    }
    return item[column] ?? '';
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

    return this.permissions[0];
  }

  private resolveOwnerImage(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;

    const trimmed = imagePath.trim();
    if (!trimmed) return null;

    if (/^(data:|https?:\/\/)/i.test(trimmed)) return trimmed;

    try {
      return new URL(trimmed, environment.apiUrl).toString();
    } catch {
      return null;
    }
  }
}
