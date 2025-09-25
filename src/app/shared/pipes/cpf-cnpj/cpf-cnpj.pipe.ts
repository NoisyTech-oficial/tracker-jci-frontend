import { Pipe, PipeTransform } from '@angular/core';
import { NgxMaskPipe } from 'ngx-mask';

@Pipe({
  name: 'cpfCnpjMask'
})
export class CpfCnpjPipe implements PipeTransform {

  constructor(private maskPipe: NgxMaskPipe) {}

  transform(value: string): string {
    if (!value) return '';

    // Define a máscara com base no tamanho do valor
    const mask = value.length <= 11 ? '000.000.000-00' : '00.000.000/0000-00';

    return this.maskPipe.transform(value, mask);
  }
}
