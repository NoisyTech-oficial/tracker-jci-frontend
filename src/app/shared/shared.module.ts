import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpfCnpjPipe } from './pipes/cpf-cnpj/cpf-cnpj.pipe';
import { CurrencyFormatPipe } from './pipes/currency-format/currency-format.pipe';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { SupportComponent } from './components/support/support.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './components/menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ExportExcelComponent } from './components/export-excel/export-excel.component';

@NgModule({
  declarations: [CurrencyFormatPipe, CpfCnpjPipe, SupportComponent, MenuComponent, HeaderComponent, ExportExcelComponent],
  exports: [CurrencyFormatPipe, CpfCnpjPipe, SupportComponent, MenuComponent, HeaderComponent, ExportExcelComponent],
  imports: [
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    NgxMaskPipe,
    provideNgxMask()
  ],
})
export class SharedModule { }
