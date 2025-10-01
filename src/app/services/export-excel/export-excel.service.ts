import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Definir larguras das colunas
    worksheet['!cols'] = [
      { wch: 35 }, // Número do processo
      { wch: 45 }, // Nome do requerente
      { wch: 20 }, // Valor do processo
      { wch: 20 }, // Número do contrato
      { wch: 20 }, // Taxa do contrato
      { wch: 20 }, // Valor do juros do contrato
      { wch: 17 }, // Valor das parcelas
      { wch: 17 }, // Parcelas pagas
      { wch: 17 }, // Parcelas faltantes
      { wch: 17 }, // Parcelas em atraso
      { wch: 20 }, // Seguro prestamista
      { wch: 45 }, // Nome do cliente
      { wch: 20 }, // Documento do cliente
      { wch: 20 }, // Telefone 1
      { wch: 20 }, // Telefone 2
      { wch: 22 }, // Cidade
      { wch: 25 }, // Email
      { wch: 25 }, // Endereço
      { wch: 20 }, // Marca do veículo
      { wch: 20 }, // Modelo do veículo
      { wch: 20 }, // Cor do veículo
      { wch: 20 }, // Ano do veículo
      { wch: 20 }, // Placa do veículo
      { wch: 20 }, // Renavam do veículo
    ];

    // Criar cabeçalho com bordas para destacar
    const header = Object.keys(data[0]);

    for (let i = 0; i < header.length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: i }); // Cabeçalho na linha 1 (r: 0)

      if (!worksheet[cellRef]) continue; // Evita erros ao acessar célula inexistente

      worksheet[cellRef].s = {
        font: { bold: true, sz: 11 }, // Negrito e tamanho 11
        alignment: { horizontal: 'center', vertical: 'center' }, // Centralizado
        border: { // Borda fina para destacar cabeçalho
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
    }

    const workbook: XLSX.WorkBook = { Sheets: { 'Funcionários': worksheet }, SheetNames: ['Funcionários'] };

    // Gerar arquivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Salvar arquivo
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocumento.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, `${fileName}.xlsx`);
  }
}
