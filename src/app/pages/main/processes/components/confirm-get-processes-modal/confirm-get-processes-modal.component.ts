import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-get-processes-modal',
  templateUrl: './confirm-get-processes-modal.component.html',
  styleUrls: ['./confirm-get-processes-modal.component.scss']
})
export class ConfirmGetProcessesModalComponent {

  haveProcesses: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmGetProcessesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public qtdProcesses: number
  ) {
    this.haveProcesses = qtdProcesses > 0 ? true : false;
  }

  close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
