import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { StatusService } from 'src/app/services/status/status.service';
import { CreateStatusDto, StatusItem, UpdateStatusDto } from 'src/app/shared/interfaces/status.interface';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';
import { StatusConfirmDialogComponent } from './status-confirm-dialog/status-confirm-dialog.component';

@Component({
  selector: 'app-status-manager',
  templateUrl: './status-manager.component.html',
  styleUrls: ['./status-manager.component.scss']
})
export class StatusManagerComponent implements OnInit {
  statuses: StatusItem[] = [];
  isLoading = false;
  error: string | null = null;

  private readonly defaultColor = '#5f71d2';

  constructor(
    private statusService: StatusService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadStatuses();
  }

  loadStatuses(): void {
    this.isLoading = true;
    this.error = null;
    this.statusService.getStatuses()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.statuses = data.map(status => this.normalizeStatus(status));
        },
        error: () => {
          this.error = 'Não foi possível carregar os status no momento.';
        }
      });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '420px',
      data: { title: 'Novo status', submitLabel: 'Criar' }
    });

    dialogRef.afterClosed().subscribe((result?: CreateStatusDto) => {
      if (!result) {
        return;
      }

      const trimmedName = result.nome.trim();
      if (!trimmedName) {
        this.error = 'Informe um nome válido.';
        return;
      }

      const payload: CreateStatusDto = {
        nome: trimmedName,
        descricao: result.descricao?.trim() || null,
        codigo_cor: result.codigo_cor || this.defaultColor
      };

      this.statusService.createStatus(payload).subscribe({
        next: (created) => {
          const normalized = this.normalizeStatus(created, payload);
          this.statuses = [normalized, ...this.statuses];
          this.error = null;
        },
        error: () => {
          this.error = 'Não foi possível criar o status.';
        }
      });
    });
  }

  openEditDialog(status: StatusItem): void {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '420px',
      data: {
        title: 'Editar status',
        submitLabel: 'Salvar',
        status
      }
    });

    dialogRef.afterClosed().subscribe((result?: CreateStatusDto) => {
      if (!result) {
        return;
      }

      const trimmedName = result.nome.trim();
      if (!trimmedName) {
        this.error = 'Informe um nome válido.';
        return;
      }

      const payload: UpdateStatusDto = {
        nome: trimmedName,
        descricao: result.descricao?.trim() || null,
        codigo_cor: result.codigo_cor || this.defaultColor
      };

      const key = String(status.id);

      this.statusService.updateStatus(status.id, payload).subscribe({
        next: (updated) => {
          const normalized = this.normalizeStatus(updated, payload);
          this.statuses = this.statuses.map(item => String(item.id) === key ? normalized : item);
          this.error = null;
        },
        error: () => {
          this.error = 'Não foi possível atualizar o status.';
        }
      });
    });
  }

  confirmDelete(status: StatusItem): void {
    const dialogRef = this.dialog.open(StatusConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Remover status',
        message: `Tem certeza que deseja remover o status "${status.nome}"?`,
        confirmLabel: 'Remover',
        cancelLabel: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      const key = String(status.id);

      this.statusService.deleteStatus(status.id).subscribe({
        next: () => {
          this.statuses = this.statuses.filter(item => String(item.id) !== key);
          this.error = null;
        },
        error: () => {
          this.error = 'Não foi possível remover o status.';
        }
      });
    });
  }

  colorFor(status: StatusItem): string {
    return status.codigo_cor || this.defaultColor;
  }

  private normalizeStatus(status: StatusItem, fallback?: Partial<CreateStatusDto>): StatusItem {
    const nome = status.nome ?? (status as any).name ?? fallback?.nome ?? '';
    const descricao = status.descricao ?? fallback?.descricao ?? null;
    const codigo_cor = status.codigo_cor || fallback?.codigo_cor || this.defaultColor;

    return {
      ...status,
      nome,
      descricao,
      codigo_cor
    };
  }

  get hasStatuses(): boolean {
    return this.statuses.length > 0;
  }
}
