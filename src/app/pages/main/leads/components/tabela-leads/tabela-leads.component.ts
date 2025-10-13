import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ObterLeads } from 'src/app/shared/interfaces/processes-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-tabela-leads',
  templateUrl: './tabela-leads.component.html',
  styleUrls: ['./tabela-leads.component.scss']
})
export class TabelaLeadsComponent {
  constructor(private masksService: MasksService) {}

  pageSize = 15;
  currentPage = 1;
  
  paginatedProcesses: ObterLeads[] = [];

  readonly permissions = ['Cliente Encontrado', 'Cliente Desconhecido', 'Processo Desativado'];
  selectedStatus: Record<number, string> = {};
  imageLoadError: Record<number, boolean> = {};

  @Input() set leadsDados(data: ObterLeads[]) {
    this.imageLoadError = {};
    this.leads = (data || []).map(lead => ({
      ...lead,
      owner: lead.owner ? { ...lead.owner, image: this.resolveOwnerImage(lead.owner.image) } : null
    }));
    this.updatePaginatedProcesses();
    this.leads.forEach(lead => {
      if (lead && typeof lead.id === 'number' && !this.selectedStatus[lead.id]) {
        this.selectedStatus[lead.id] = this.permissions[0];
      }
    });
  }

  @Input() isLoading: boolean = false;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  @Output() verDetalhesClicked = new EventEmitter<number>();
  @Output() statusChanged = new EventEmitter<{ status: string; processNumber: string | null | undefined }>();

  leads: ObterLeads[] = [];

  sortBy(column: keyof ObterLeads): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  
    this.leads.sort((a, b) => {
      const valA = this.extractSortableValue(a, column);
      const valB = this.extractSortableValue(b, column);

      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return this.sortDirection === 'asc'
        ? String(valA ?? '').localeCompare(String(valB ?? ''))
        : String(valB ?? '').localeCompare(String(valA ?? ''));
    });
  
    this.currentPage = 1;
    this.updatePaginatedProcesses();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.updatePaginatedProcesses();
  }
  
  updatePaginatedProcesses(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProcesses = this.leads.slice(start, end);
  }

  verDetalhes(id: number) {
    this.verDetalhesClicked.emit(id);
  }

  onImageError(leadId: number): void {
    this.imageLoadError[leadId] = true;
  }

  formatDocument(value: string | null | undefined): string | undefined {
    const format = this.masksService.formatDocument(value);
    return format ? format : undefined
  }

  formatName(value: string | null | undefined): string | undefined {
    const formatted = this.masksService.formatName(value);
    return formatted && formatted.trim() ? formatted : undefined;
  }

  formatPhone(value: string | null | undefined): string | undefined {
    return this.masksService.formatPhone(value);
  }

  postNewStatus(permission: string, processNumber: string | null | undefined, leadId: number): void {
    if (leadId) {
      this.selectedStatus[leadId] = permission;
    }
    this.statusChanged.emit({ status: permission, processNumber });
  }

  getElapsedTimeMask(date: string | Date): string {
    return this.masksService.getElapsedTimeMask(date);
  }

  getFormatDateToLabel(date: string): string {
    return this.masksService.getFormatDateToLabel(date);
  }

  get totalPages(): number {
    return Math.ceil(this.leads.length / this.pageSize);
  }
  
  get totalPagesArray(): number[] {
    const blockSize = 10; // tamanho do bloco total (10 páginas)
    const halfBlock = Math.floor(blockSize / 2); // metade do bloco (5)

    let start = this.currentPage - halfBlock;
    let end = this.currentPage + halfBlock - 1;
  
    // Corrige se estiver no início
    if (start < 1) {
      end += 1 - start;
      start = 1;
    }
  
    // Corrige se ultrapassar total de páginas
    if (end > this.totalPages) {
      start -= end - this.totalPages;
      end = this.totalPages;
      if (start < 1) start = 1;
    }
  
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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

    const value = item[column];
    return value ?? '';
  }

  private resolveOwnerImage(imagePath: string | null | undefined): string | null {
    if (!imagePath) {
      return null;
    }

    const trimmed = imagePath.trim();
    if (!trimmed) {
      return null;
    }

    if (/^(data:|https?:\/\/)/i.test(trimmed)) {
      return trimmed;
    }

    try {
      return new URL(trimmed, environment.apiUrl).toString();
    } catch {
      return null;
    }
  }
}
