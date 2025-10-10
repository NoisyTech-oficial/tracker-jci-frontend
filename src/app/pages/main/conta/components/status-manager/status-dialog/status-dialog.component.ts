import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateStatusDto } from 'src/app/shared/interfaces/status.interface';

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<CreateStatusDto> | null
  ) {
    this.form = this.fb.group({
      nome: [
        data?.nome || '',
        [Validators.required, Validators.maxLength(80), Validators.pattern(/.*\S.*/)]
      ],
      descricao: [data?.descricao || '', [Validators.maxLength(160)]],
      codigo_cor: [data?.codigo_cor || '#5f71d2']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.value as CreateStatusDto);
  }

  get nomeControl() {
    return this.form.get('nome');
  }

  get descricaoControl() {
    return this.form.get('descricao');
  }
}
