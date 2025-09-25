import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProcessObtained } from 'src/app/shared/interfaces/processes-obtained-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';

@Component({
  selector: 'app-table-processes-obtained',
  templateUrl: './table-processes-obtained.component.html',
  styleUrls: ['./table-processes-obtained.component.scss']
})
export class TableProcessesObtainedComponent {
  constructor(private masksService: MasksService) {}
  
  pageSize = 15;
  currentPage = 1;
  
  paginatedProcesses: ProcessObtained[] = [];

  @Input() set processes(data: ProcessObtained[]) {
    this.filteredProcesses = data;
    this.updatePaginatedProcesses();
  }

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  @Output() postNewStatusEmit = new EventEmitter<{
    permission: string,
    process_number: string
  }>();
  
  @Output() sortByColumn = new EventEmitter<string>();
  @Output() statusUpdated = new EventEmitter<{ status: string, processNumber: string }>();
  @Output() seeMoreClicked = new EventEmitter<number>();

  permissions = ["Cliente Encontrado", "Cliente Desconhecido", "Processo Desativado"];
  filteredProcesses: ProcessObtained[] = [];

  sortBy(column: keyof ProcessObtained): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  
    this.filteredProcesses.sort((a: any, b: any) => {
      const valA = a[column] ?? '';
      const valB = b[column] ?? '';
  
      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }
  
      return this.sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
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
    this.paginatedProcesses = this.filteredProcesses.slice(start, end);
  }

  onSort(column: string) {
    this.sortByColumn.emit(column);
  }

  onStatusChange(status: string, processNumber: string) {
    this.statusUpdated.emit({ status, processNumber });
  }

  onSeeMore(index: number) {
    this.seeMoreClicked.emit(index);
  }

  formatDocument(value: string | undefined): string | undefined {
    const format = this.masksService.formatDocument(value);
    return format ? format : undefined
  }

  postNewStatus(permission: string, process_number: string) {
    const data = {
      permission: permission,
      process_number: process_number
    }
    this.postNewStatusEmit.emit(data);
  }

  getElapsedTimeMask(date: string | Date): string {
    return this.masksService.getElapsedTimeMask(date);
  }

  getFormatDateToLabel(date: string): string {
    return this.masksService.getFormatDateToLabel(date);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProcesses.length / this.pageSize);
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
}
