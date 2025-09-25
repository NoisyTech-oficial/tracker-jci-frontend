import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.scss']
})
export class ExportExcelComponent implements OnInit {

  filtro = {
    dataInicio: '',
    horaInicio: '',
    dataFim: '',
    horaFim: ''
  };

  constructor(
    public dialogRef: MatDialogRef<ExportExcelComponent>,
  ) {}

  ngOnInit(): void {
    this.setDateInitialFilter();
  }

  setDateInitialFilter() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
  
    const hoje = `${yyyy}-${mm}-${dd}`;
  
    this.filtro.dataInicio = hoje;
    this.filtro.horaInicio = '00:00';
  
    this.filtro.dataFim = hoje;
    this.filtro.horaFim = '12:00';
  }

  onExportClick() {
    const data = { 
      dataInicio: new Date(`${this.filtro.dataInicio}T${this.filtro.horaInicio}`), 
      dataFim: new Date(`${this.filtro.dataFim}T${this.filtro.horaFim}`)
    };

    this.dialogRef.close(data);
  }

  close(): void {
    this.dialogRef.close();
  }
}
