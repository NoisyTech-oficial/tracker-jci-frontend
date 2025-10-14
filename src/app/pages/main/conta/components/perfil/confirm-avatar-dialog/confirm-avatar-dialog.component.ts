import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ConfirmAvatarDialogData {
  preview: string;
}

@Component({
  selector: 'app-confirm-avatar-dialog',
  templateUrl: './confirm-avatar-dialog.component.html',
  styleUrls: ['./confirm-avatar-dialog.component.scss']
})
export class ConfirmAvatarDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<ConfirmAvatarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmAvatarDialogData
  ) { }

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
