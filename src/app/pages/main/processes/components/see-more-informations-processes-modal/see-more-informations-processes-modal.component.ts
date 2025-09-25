import { MasksService } from './../../../../../shared/masks/masks.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';
import { Process } from 'src/app/shared/interfaces/processes-data.interface';

@Component({
  selector: 'app-see-more-informations-processes-modal',
  templateUrl: './see-more-informations-processes-modal.component.html',
  styleUrls: ['./see-more-informations-processes-modal.component.scss']
})
export class SeeMoreInformationsProcessesModalComponent implements OnInit {
  fieldsProcess: { label: string; value: string | number | null | undefined }[] = [];
  fieldsClient: { label: string; value: string | number | null | undefined }[] = [];
  fieldsVehicle: { label: string; value: string | number | null | undefined }[] = [];

  constructor(
    public dialogRef: MatDialogRef<SeeMoreInformationsProcessesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Process,
    private masksService: MasksService,
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
      { label: 'Cidade', value: this.data?.cep?.city },
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
  }

  setFieldsWithPlus() {
    this.fieldsProcess = [
      { label: 'Número', value: this.data?.process_number },
      { label: 'Requerente', value: this.data?.applicant_name },
      { label: 'Valor', value: this.formatCurrency(parseFloat(this.data?.value!)) },
      { label: 'Número do contrato', value: this.data?.contract_number },
      { label: 'Taxa do contrato', value: this.formatPercentage(this.data?.contract_fee) },
      { label: 'Valor do juros do contrato', value: this.formatCurrency(this.data?.contract_interest_rate) },
      { label: 'Valor das parcelas', value: this.formatCurrency(this.data?.installment_amount) },
      { label: 'Parcelas pagas', value: this.data?.paid_installments },
      { label: 'Parcelas faltantes', value: this.data?.remaining_installments },
      { label: 'Parcelas em atraso', value: this.data?.overdue_installments },
      { label: 'Seguro prestamista', value: this.formatCreditLifeInsurance(this.data?.credit_life_insurance) },
    ];

    this.fieldsClient = [
      { label: 'Nome', value: this.data?.company_name },
      { label: 'Documento', value: this.formatDocument(this.data?.cpf_cnpj) },
      { label: 'Telefone 1', value: this.formatPhone(this.data?.phone1) },
      { label: 'Telefone 2', value: this.formatPhone(this.data?.phone2) },
      { label: 'Cidade', value: this.data?.cep?.city },
      { label: 'Email', value: this.data?.email },
      { label: 'Endereço', value: this.data?.address },
    ];

    this.fieldsVehicle = [
      { label: 'Marca do veículo', value: this.data?.vehicle_brand },
      { label: 'Modelo do veículo', value: this.data?.vehicle_model },
      { label: 'Cor do veículo', value: this.data?.vehicle_color },
      { label: 'Ano do veículo', value: this.data?.vehicle_year },
      { label: 'Placa do veículo', value: this.formatPlateVehicle(this.data?.vehicle_plate) },
      { label: 'Renavam do veículo', value: this.data?.vehicle_renavam }
    ];
  }

  formatCreditLifeInsurance(status: boolean | undefined | null): string | null {
    if (!status) return null;
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

  close(): void {
    this.dialogRef.close();
  }
}
