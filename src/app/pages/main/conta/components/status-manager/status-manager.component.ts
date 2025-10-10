import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { StatusService } from 'src/app/services/status/status.service';
import { CreateStatusDto, StatusItem, UpdateStatusDto } from 'src/app/shared/interfaces/status.interface';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';

@Component({
  selector: 'app-status-manager',
  templateUrl: './status-manager.component.html',
  styleUrls: ['./status-manager.component.scss']
})
export class StatusManagerComponent implements OnInit {
  statuses: StatusItem[] = [];
  isLoading = false;
  error: string | null = null;

  editForms: Record<string, FormGroup> = {};
  editingId: string | null = null;

  private readonly defaultColor = '#5f71d2';
  private readonly nameValidators = [
    Validators.required,
    Validators.maxLength(80),
    Validators.pattern(/.*\S.*/)
  ];

  constructor(
    private statusService: StatusService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadStatuses();
  }

  loadStatuses(): void {
    this.isLoading = true;
    this.error = null;
    this.editingId = null;
    this.statusService.getStatuses()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.statuses = data.map(status => this.normalizeStatus(status));
          this.buildEditForms();
        },
        error: () => {
          this.error = 'Não foi possível carregar os status no momento.';
        }
      });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '420px',
      data: null
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
          this.buildEditForms();
          this.error = null;
        },
        error: () => {
          this.error = 'Não foi possível criar o status.';
        }
      });
    });
  }

  buildEditForms(): void {
    this.editForms = {};
    this.statuses.forEach(status => {
      const key = String(status.id);
      this.editForms[key] = this.fb.group({
        nome: [status.nome, this.nameValidators],
        descricao: [status.descricao || '', [Validators.maxLength(160)]],
        codigo_cor: [status.codigo_cor || this.defaultColor]
      });
    });
  }

  startEdit(id: number | string): void {
    this.editingId = String(id);
  }

  cancelEdit(): void {
    if (this.editingId) {
      const original = this.statuses.find(status => String(status.id) === this.editingId);
      if (original) {
        this.editForms[this.editingId].setValue({
          nome: original.nome,
          descricao: original.descricao || '',
          codigo_cor: original.codigo_cor || this.defaultColor
        });
      }
    }
    this.editingId = null;
  }

  updateStatus(id: number | string): void {
    const key = String(id);
    const form = this.editForms[key];
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      return;
    }

    const value = form.value as UpdateStatusDto;
    const trimmedName = value.nome.trim();
    if (!trimmedName) {
      form.get('nome')?.setErrors({ required: true });
      form.get('nome')?.markAsTouched();
      return;
    }

    const payload: UpdateStatusDto = {
      nome: trimmedName,
      descricao: value.descricao?.trim() || null,
      codigo_cor: value.codigo_cor || this.defaultColor
    };

    this.statusService.updateStatus(id, payload).subscribe({
      next: (updated) => {
        const normalized = this.normalizeStatus(updated, payload);
        this.statuses = this.statuses.map(status => String(status.id) === key ? normalized : status);
        this.buildEditForms();
        this.editingId = null;
        this.error = null;
      },
      error: () => {
        this.error = 'Não foi possível atualizar o status.';
      }
    });
  }

  deleteStatus(id: number | string): void {
    if (!confirm('Tem certeza que deseja remover este status?')) {
      return;
    }

    this.statusService.deleteStatus(id).subscribe({
      next: () => {
        const key = String(id);
        this.statuses = this.statuses.filter(status => String(status.id) !== key);
        delete this.editForms[key];
        this.error = null;
      },
      error: () => {
        this.error = 'Não foi possível remover o status.';
      }
    });
  }

  colorFor(status: StatusItem): string {
    return status.codigo_cor || this.defaultColor;
  }

  private normalizeStatus(status: StatusItem, fallback?: Partial<CreateStatusDto>): StatusItem {
    return {
      ...status,
      descricao: status.descricao ?? fallback?.descricao ?? null,
      codigo_cor: status.codigo_cor || fallback?.codigo_cor || this.defaultColor
    };
  }

  get hasStatuses(): boolean {
    return this.statuses.length > 0;
  }
}
