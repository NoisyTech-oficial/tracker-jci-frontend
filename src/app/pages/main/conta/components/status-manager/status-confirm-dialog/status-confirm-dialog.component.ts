import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface StatusConfirmDialogData {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-status-confirm-dialog',
  templateUrl: './status-confirm-dialog.component.html',
  styleUrls: ['./status-confirm-dialog.component.scss']
})
export class StatusConfirmDialogComponent {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;

  constructor(
    private dialogRef: MatDialogRef<StatusConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StatusConfirmDialogData
  ) {
    this.title = data.title || 'Confirmar ação';
    this.message = data.message || 'Deseja continuar com esta ação?';
    this.confirmLabel = data.confirmLabel || 'Confirmar';
    this.cancelLabel = data.cancelLabel || 'Cancelar';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
