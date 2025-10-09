import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ObterLeads } from 'src/app/shared/interfaces/processes-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';

@Component({
  selector: 'app-tabela-leads',
  templateUrl: './tabela-leads.component.html',
  styleUrls: ['./tabela-leads.component.scss']
})
export class TabelaLeadsComponent {
  constructor(private masksService: MasksService) {}

  pageSize = 15;
  currentPage = 1;

  blockSize = 10;
  currentBlock = 1;
  
  paginatedProcesses: ObterLeads[] = [];

  @Input() set leadsDados(data: ObterLeads[]) {
    this.leads = data;
    this.updatePaginatedProcesses();
  }

  @Input() isLoading: boolean = false;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  @Output() verDetalhesClicked = new EventEmitter<number>();
  @Output() sortByColumn = new EventEmitter<string>();

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
  
    const newBlock = Math.floor((page - 1) / this.blockSize) + 1;
    if (newBlock !== this.currentBlock) {
      this.currentBlock = newBlock;
    }
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.currentBlock = 1;
    this.updatePaginatedProcesses();
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.currentBlock = Math.ceil(this.totalPages / this.blockSize);
    this.updatePaginatedProcesses();
  }
  
  updatePaginatedProcesses(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProcesses = this.leads.slice(start, end);
  }

  onSort(column: string) {
    this.sortByColumn.emit(column);
  }

  verDetalhes(id: number) {
    this.verDetalhesClicked.emit(id);
  }

  formatDocument(value: string | null | undefined): string | undefined {
    const format = this.masksService.formatDocument(value);
    return format ? format : undefined
  }

  formatPhone(value: string | null | undefined): string | undefined {
    return this.masksService.formatPhone(value);
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

  get currentBlockStart(): number {
    return Math.floor((this.currentPage - 1) / 9) * 9 + 1;
  }

  get currentBlockEnd(): number {
    return Math.min(this.currentBlockStart + 9, this.totalPages);
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
    const value = item[column];

    if (column === 'createdAt') {
      return value ? new Date(value).getTime() : 0;
    }

    return value ?? '';
  }
}
