import { Injectable } from '@angular/core';
import { ObterLeads } from 'src/app/shared/interfaces/processes-data.interface';

@Injectable({ providedIn: 'root' })
export class LeadDetailsService {
  private leadResumo: ObterLeads | null = null;

  setLead(lead: ObterLeads | null): void {
    this.leadResumo = lead ? { ...lead } : null;
  }

  getLead(): ObterLeads | null {
    return this.leadResumo ? { ...this.leadResumo } : null;
  }

  clear(): void {
    this.leadResumo = null;
  }
}
