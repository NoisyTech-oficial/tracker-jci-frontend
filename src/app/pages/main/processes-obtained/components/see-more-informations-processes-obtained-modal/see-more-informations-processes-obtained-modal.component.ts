import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProcessObtained, putStatusOrNotesProcess } from 'src/app/shared/interfaces/processes-obtained-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';

@Component({
  selector: 'app-see-more-informations-processes-obtained-modal',
  templateUrl: './see-more-informations-processes-obtained-modal.component.html',
  styleUrls: ['./see-more-informations-processes-obtained-modal.component.scss']
})
export class SeeMoreInformationsProcessesObtainedModalComponent implements OnInit {
  fieldsProcess: { label: string; value: string | number | null | undefined }[] = [];
  fieldsClient: { label: string; value: string | number | null | undefined }[] = [];
  fieldsVehicle: { label: string; value: string | number | null | undefined }[] = [];

  notes: string = '';
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SeeMoreInformationsProcessesObtainedModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProcessObtained,
    private masksService: MasksService,
    private processesService: ProcessesService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getUserData();
    user.plan_plus ? this.setFieldsWithPlus() : this.setFieldsWithoutPlus();
  }
  
  setFieldsWithoutPlus() {
    this.fieldsProcess = [
      { label: 'Número', value: this.data?.process_number },
      { label: 'Requerente', value: this.data?.applicant_name },
      { label: 'Valor', value: this.formatCurrency(parseFloat(this.data?.value!)) },
      { label: 'Número do contrato', value: undefined },
      { label: 'Taxa do contrato', value: undefined },
      { label: 'Valor do juros do contrato', value: undefined },
      { label: 'Valor das parcelas', value: undefined },
      { label: 'Parcelas pagas', value: undefined },
      { label: 'Parcelas faltantes', value: undefined },
      { label: 'Parcelas em atraso', value: undefined },
      { label: 'Seguro prestamista', value: undefined },
    ];

    this.fieldsClient = [
      { label: 'Nome', value: this.data?.company_name },
      { label: 'Documento', value: this.formatDocument(this.data?.cpf_cnpj) },
      { label: 'Telefone 1', value: this.formatPhone(this.data?.phone1) },
      { label: 'Telefone 2', value: this.formatPhone(this.data?.phone2) },
      { label: 'Cidade', value: this.data?.cep!.city },
      { label: 'Email', value: undefined },
      { label: 'Endereço', value: undefined },
    ];

    this.fieldsVehicle = [
      { label: 'Marca do veículo', value: undefined },
      { label: 'Modelo do veículo', value: undefined },
      { label: 'Cor do veículo', value: undefined },
      { label: 'Ano do veículo', value: undefined },
      { label: 'Placa do veículo', value: undefined },
      { label: 'Renavam do veículo', value: undefined }
    ];
    
    this.notes = this.data.notes ?? "";
  }

  setFieldsWithPlus() {
    this.fieldsProcess = [
      { label: 'Número', value: this.data?.process_number || null },
      { label: 'Requerente', value: this.data?.applicant_name || null },
      { label: 'Valor', value: this.formatCurrency(parseFloat(this.data?.value!)) || null },
      { label: 'Número do contrato', value: this.data?.contract_number || null },
      { label: 'Taxa do contrato', value: this.formatPercentage(this.data?.contract_fee) || null },
      { label: 'Valor do juros do contrato', value: this.formatCurrency(this.data?.contract_interest_rate) || null },
      { label: 'Valor das parcelas', value: this.formatCurrency(this.data?.installment_amount) },
      { label: 'Parcelas pagas', value: this.data?.paid_installments || null },
      { label: 'Parcelas faltantes', value: this.data?.remaining_installments || null },
      { label: 'Parcelas em atraso', value: this.data?.overdue_installments || null },
      { label: 'Seguro prestamista', value: this.formatCreditLifeInsurance(this.data?.credit_life_insurance!) },
    ];

    this.fieldsClient = [
      { label: 'Nome', value: this.data?.company_name || null },
      { label: 'Documento', value: this.formatDocument(this.data?.cpf_cnpj) || null},
      { label: 'Telefone 1', value: this.formatPhone(this.data?.phone1) || null },
      { label: 'Telefone 2', value: this.formatPhone(this.data?.phone2) || null },
      { label: 'Cidade', value: this.data?.cep!.city || null },
      { label: 'Email', value: this.data?.email || null },
      { label: 'Endereço', value: this.data?.address || null },
    ];

    this.fieldsVehicle = [
      { label: 'Marca do veículo', value: this.data?.vehicle_brand || null },
      { label: 'Modelo do veículo', value: this.data?.vehicle_model || null },
      { label: 'Cor do veículo', value: this.data?.vehicle_color || null },
      { label: 'Ano do veículo', value: this.data?.vehicle_year || null },
      { label: 'Placa do veículo', value: this.formatPlateVehicle(this.data?.vehicle_plate) || null },
      { label: 'Renavam do veículo', value: this.data?.vehicle_renavam || null }
    ];

    this.notes = this.data.notes ?? "";
  }

  formatCreditLifeInsurance(status: boolean | undefined): string | null {
    if (status === undefined) return null;
    return status ? 'Sim' : 'Não';
  }

  formatCurrency(value: number | undefined | null): string | null {
    const format = this.masksService.formatCurrency(value);
    return format ? format : null
  }

  formatPercentage(value: number | undefined | null): string | null {
    const format = this.masksService.formatPercentage(value);
    return format ? format : null
  }

  formatDocument(value: string | undefined | null): string | null {
    const format = this.masksService.formatDocument(value);
    return format ? format : null
  }

  formatPhone(value: string | undefined | null): string | null {
    const format = this.masksService.formatPhone(value);
    return format ? format : null
  }

  formatPlateVehicle(value: string | undefined | null): string | null {
    const format = this.masksService.formatPlateVehicle(value);
    return format ? format : null;
  }

  saveNote() {
    this.isLoading = true;

    const body: putStatusOrNotesProcess = {
      processNumber: this.data.process_number,
      notes: this.notes
    }
    
    this.processesService.putStatusOrNotesProcess(body).subscribe({
      next: () => {
        this.data.notes = this.notes;
        this.notificationService.showMessage('Observação incluída com sucesso.', 'success');
        this.close();
      },
      error: () => {
        this.notificationService.showMessage('Erro ao incluir a observação, tente novamente.', 'error');
        this.isLoading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}

