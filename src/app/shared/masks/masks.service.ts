import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasksService {

  constructor() { }

  formatCPF(documento: string): string {
    if (!documento) return '';

    return documento
      .replace(/\D/g, '') // 🔥 Remove tudo que não for número
      .replace(/(\d{3})(\d)/, '$1.$2') // 🔥 Adiciona o primeiro ponto
      .replace(/(\d{3})(\d)/, '$1.$2') // 🔥 Adiciona o segundo ponto
      .replace(/(\d{3})(\d{2})$/, '$1-$2'); // 🔥 Adiciona o traço antes dos últimos 2 dígitos
  }

  formatCurrency(value: number | undefined | null): string | undefined {
    if (!value) return undefined;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  formatPercentage(value: number | undefined | null): string | undefined {
    if (!value) return undefined;
    return `${value.toFixed(2)}%`;
  }

  formatDocument(value: string | undefined | null): string | undefined {
    if (!value) return undefined;
  
    // Remove caracteres não numéricos
    let cleanValue = value.replace(/\D/g, '');
  
    // Se for CPF com 10 dígitos, adiciona 0 à esquerda
    if (cleanValue.length === 10) {
      cleanValue = '0' + cleanValue;
    }
  
    // Formata CPF ou CNPJ
    if (cleanValue.length === 11) {
      return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleanValue.length === 14) {
      return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
      return value; // Retorna original se não for 11 ou 14 dígitos
    }
  }  

  formatPhone(value: string | undefined | null): string | undefined {
    if (!value) return undefined;

    // Remove todos os caracteres não numéricos
    let cleanValue = value.replace(/\D/g, '');

    // Verifica se já tem o "55" no início e remove se necessário
    if (cleanValue.startsWith('55') && cleanValue.length > 10) {
      cleanValue = cleanValue.substring(2); // Remove o "55"
    }

    // Formato para celular (11 dígitos) -> "+55 XX XXXXX-XXXX"
    if (cleanValue.length === 11) {
      return `+55 ${cleanValue.substring(0, 2)} ${cleanValue.substring(2, 7)}-${cleanValue.substring(7)}`;
    }

    // Formato para telefone fixo (10 dígitos) -> "+55 XX XXXX-XXXX"
    if (cleanValue.length === 10) {
      return `+55 ${cleanValue.substring(0, 2)} ${cleanValue.substring(2, 6)}-${cleanValue.substring(6)}`;
    }

    return value; // Retorna sem alterações se não corresponder ao padrão esperado
  }

  formatPlateVehicle(value: string | undefined | null): string | undefined {
    if (!value) return undefined;

    // Remove espaços e caracteres não alfanuméricos
    let cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Verifica se a placa tem o novo padrão Mercosul (7 caracteres, sendo o 4º um número)
    if (cleanValue.length === 7 && /\d/.test(cleanValue[3])) {
      return `${cleanValue.substring(0, 3)}-${cleanValue.substring(3)}`;
    }

    return cleanValue; // Retorna sem alterações se não corresponder ao padrão esperado
  }

  getElapsedTimeMask(data: string | Date): string {
    let dataProcesso: Date;
  
    if (typeof data === 'string' && data.includes('T')) {
      const [datePart, timePart] = data.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      dataProcesso = new Date(year, month - 1, day); // <-- Sem UTC shift
    } else {
      dataProcesso = new Date(data);
    }
  
    const agora = new Date();
  
    const processoDate = new Date(dataProcesso.getFullYear(), dataProcesso.getMonth(), dataProcesso.getDate());
    const today = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    if (processoDate.getTime() === today.getTime()) {
      return 'Hoje';
    }
  
    if (processoDate.getTime() === yesterday.getTime()) {
      return 'Ontem';
    }
  
    const diffMs = agora.getTime() - processoDate.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    if (diffDias < 7) {
      return `há ${diffDias} dias`;
    }
  
    const time = dataProcesso.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = dataProcesso.toLocaleDateString('pt-BR');
  
    return `${formattedDate} (${time})`;
  }
  

  getFormatDateToLabel(dateString: string): string {
    const data = new Date(dateString);
    const agora = new Date();
  
    const processoDate = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    const today = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    const time = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
    if (processoDate.getTime() === today.getTime()) {
      return `Hoje às ${time}`;
    }
  
    if (processoDate.getTime() === yesterday.getTime()) {
      return `Ontem às ${time}`;
    }
  
    const formattedDate = data.toLocaleDateString('pt-BR');
    return `${formattedDate} às ${time}`;
  }
  
  
}
