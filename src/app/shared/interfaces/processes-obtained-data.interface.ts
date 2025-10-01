import { Process } from "./processes-data.interface"

export interface ProcessObtained extends Process {
  export_documento: string;
  data_exporting: string;
  crm_update_documento: string;
  status: string | null;
  notes: string | null;
}

export interface NumberProcessObtained {
  limitProcesses: number;
  usedProcesses: number;
}

export interface putStatusOrNotesProcess {
  processNumber: string;
  status?: string;
  notes?: string;
}