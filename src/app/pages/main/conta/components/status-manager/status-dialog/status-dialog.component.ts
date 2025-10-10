import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateStatusDto, StatusItem } from 'src/app/shared/interfaces/status.interface';

export interface StatusDialogData {
  title?: string;
  submitLabel?: string;
  status?: StatusItem;
}

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent {
  form: FormGroup;
  title: string;
  submitLabel: string;
  private readonly defaultColor = '#5f71d2';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StatusDialogData | null
  ) {
    const status = data?.status;
    this.title = data?.title || (status ? 'Editar status' : 'Novo status');
    this.submitLabel = data?.submitLabel || (status ? 'Salvar' : 'Criar');

    this.form = this.fb.group({
      nome: [
        status?.nome || '',
        [Validators.required, Validators.maxLength(80), Validators.pattern(/.*\S.*/)]
      ],
      descricao: [status?.descricao || '', [Validators.maxLength(160)]],
      codigo_cor: [status?.codigo_cor || this.defaultColor]
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
