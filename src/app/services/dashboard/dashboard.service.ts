import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.dev';

export type Preset = 'hoje' | 7 | 15 | 30;
export type Mode = 'preset' | 'custom';

export interface DashboardData {
  kpis: Array<{ label: string; value: number }>;
  series: Array<{ date: string; value: number }>;
  updatedAt: string; // ISO string
}

interface CacheEntry {
  data: DashboardData;
  expiresAt: number;
  inflight$?: Observable<DashboardData>;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  private TTL_MS = 5 * 60 * 1000; // 5 minutos
  private cache = new Map<string, CacheEntry>();

  private presetEndpoint(preset: Preset): string {
    switch (preset) {
      case 'hoje':
        return `${this.base}/dashboard-processos/dashboard/hoje`;
      case 7:
        return `${this.base}/dashboard-processos/dashboard/7-dias`;
      case 15:
        return `${this.base}/dashboard-processos/dashboard/15-dias`;
      case 30:
        return `${this.base}/dashboard-processos/dashboard/30-dias`;
    }
  }

  private customEndpoint(fromISO: string, toISO: string): string {
    const q = new URLSearchParams({
      data_inicio: fromISO,
      data_fim: toISO,
    }).toString();
    return `${this.base}/dashboard-processos/dashboard/customizado?${q}`;
  }

  private keyForPreset(p: Preset) { return `preset:${p}`; }
  private keyForCustom(from: string, to: string) { return `custom:${from}|${to}`; }

  private fetchWithCache(key: string, url: string): Observable<DashboardData> {
    const now = Date.now();
    const hit = this.cache.get(key);

    // Cache válido
    if (hit && hit.expiresAt > now) return of(hit.data);

    // Cache stale: devolve cache e revalida em background
    if (hit && hit.expiresAt <= now) {
      this.revalidate(key, url);
      return of(hit.data);
    }

    // Sem cache: busca e grava
    const inflight$ = this.http.get<DashboardData>(url).pipe(
      tap(data => this.cache.set(key, { data, expiresAt: now + this.TTL_MS })),
      shareReplay(1)
    );

    this.cache.set(key, { data: hit?.data as any, expiresAt: now, inflight$ });
    return inflight$;
  }

  private revalidate(key: string, url: string) {
    const entry = this.cache.get(key);
    if (entry?.inflight$) return; // já revalidando

    const now = Date.now();
    const inflight$ = this.http.get<DashboardData>(url).pipe(
      tap(data => this.cache.set(key, { data, expiresAt: now + this.TTL_MS })),
      shareReplay(1)
    );

    this.cache.set(key, { ...(entry as CacheEntry), inflight$ });
    inflight$.subscribe({
      next: () => this.cache.set(key, { data: (this.cache.get(key) as CacheEntry).data, expiresAt: now + this.TTL_MS }),
      error: () => this.cache.set(key, { ...(this.cache.get(key) as CacheEntry), inflight$: undefined })
    });
  }

  getByPreset(preset: Preset): Observable<DashboardData> {
    return this.fetchWithCache(this.keyForPreset(preset), this.presetEndpoint(preset));
  }

  getByCustom(fromISO: string, toISO: string): Observable<DashboardData> {
    return this.fetchWithCache(this.keyForCustom(fromISO, toISO), this.customEndpoint(fromISO, toISO));
  }

  invalidateAll() { this.cache.clear(); }
}
