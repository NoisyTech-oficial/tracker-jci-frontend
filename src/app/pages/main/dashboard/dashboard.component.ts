import { Component, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { DashboardService, Preset } from 'src/app/services/dashboard/dashboard.service';

type Mode = 'preset' | 'custom';

interface Kpis {
  media: number;
  total: number;
}

interface ChartPoint {
  date: string;   // "YYYY-MM-DD"
  value: number;  // total do dia
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // ======= STATE =======
  headerSubtitle = '7 dias';
  rangePreset = 7 as 7 | 15 | 30;
  startDate?: string;
  endDate?: string;

  mode = signal<Mode>('preset');
  isLoading = signal<boolean>(false);
  isTodayLoading = signal<boolean>(false);
  errorMsg = '';

  // KPIs
  todayTotal = 0;
  kpis: Kpis = { media: 0, total: 0 };
  lastUpdate = '';

  // Tooltip "Totais hoje"
  showTodayInfo = false;

  // Skeleton rows (visual)
  skeletonRows = Array.from({ length: 6 });

  // ======= GRÁFICO =======
  chartData: ChartPoint[] = [];
  yTicks: number[] = [];
  private maxValue = 0;
  private scaleTop = 0;

  // ======= Animação =======
  private animProgress = 1;
  private animTimer: any;

  constructor(private dashboardService: DashboardService) {}

  // ======= CICLO =======
  ngOnInit() {
    this.setPreset(7);
  }

  // ======= UI =======
  toggleTodayInfo() {
    this.showTodayInfo = !this.showTodayInfo;
  }

  dLabel(dateStr: string): string {
    const [y, m, d] = (dateStr || '').split('-');
    if (!y || !m || !d) return dateStr;
    return `${d}/${m}`;
  }

  private formatTimeOnly(dateTimeStr: string): string {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // ======= PRESETS / CUSTOM =======
  setPreset(days: 7 | 15 | 30) {
    this.mode.set('preset');
    this.rangePreset = days;
    this.headerSubtitle = `${days} dias`;
    this.startDate = undefined;
    this.endDate = undefined;
    this.fetchAllForPreset(days);
  }

  applyCustom() {
    if (!this.startDate || !this.endDate) return;
    this.mode.set('custom');
    this.headerSubtitle = 'período customizado';
    this.fetchAllForCustom(this.startDate, this.endDate);
  }

  exportCsv() {
    // sua implementação
  }

  // ======= FETCH =======
  private fetchAllForPreset(days: 7 | 15 | 30) {
    this.isLoading.set(true);
    this.errorMsg = '';

    this.dashboardService.getByPreset(days as Preset)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res: any) => {
          this.applyPayload(res);
          this.applyKPIsFromPayload(res);
        },
        error: () => {
          this.errorMsg = 'Erro ao carregar o gráfico.';
        }
      });

    this.fetchTodayTotals();
  }

  private fetchAllForCustom(fromISO: string, toISO: string) {
    this.isLoading.set(true);
    this.errorMsg = '';

    this.dashboardService.getByCustom(fromISO, toISO)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res: any) => {
          this.applyPayload(res);
          this.applyKPIsFromPayload(res);
        },
        error: () => {
          this.errorMsg = 'Erro ao carregar o gráfico.';
        }
      });

    this.fetchTodayTotals();
  }

  private fetchTodayTotals() {
    this.isTodayLoading.set(true);

    this.dashboardService.getByPreset('hoje')
      .pipe(finalize(() => this.isTodayLoading.set(false)))
      .subscribe({
        next: (resHoje: any) => {
          const today = this.parseToday(resHoje);
          this.todayTotal = today.total;
          this.lastUpdate = this.formatTimeOnly(today.timestamp);
        },
        error: () => {
          // mantém último valor
        }
      });
  }

  // ======= NORMALIZAÇÃO + ESCALA =======
  applyPayload(payload: any) {
    const series = this.extractSeries(payload);

    // Sem série válida → não sobrescreve
    if (series.length === 0) return;

    // Ordena por data
    series.sort((a: any, b: any) => {
      const ta = new Date(a?.data ?? a?.date ?? a?.dia ?? 0).getTime();
      const tb = new Date(b?.data ?? b?.date ?? b?.dia ?? 0).getTime();
      return ta - tb;
    });

    const nextData: ChartPoint[] = series
      .map((d: any) => ({
        date: d?.data ?? d?.date ?? d?.dia ?? d?.label ?? '',
        value: Number(
          d?.total ??
          d?.value ??
          d?.quantidade ??
          d?.qtd ??
          d?.count ??
          0
        )
      }))
      .filter(p => p.date);

    // Em presets/custom esperamos série real (≥2)
    const isPresetOrCustom = this.mode() === 'preset' || this.mode() === 'custom';
    if (isPresetOrCustom && nextData.length <= 1) {
      // evita que /hoje (1 ponto) apague a série
      return;
    }

    this.chartData = nextData;
    this.recomputeMax();
    this.buildYTicks();
    this.startBarsAnimation();
  }

  private applyKPIsFromPayload(payload: any) {
    const raw = this.extractSeries(payload);
    const vals = raw.map((d: any) => Number(
      d?.total ?? d?.value ?? d?.quantidade ?? d?.qtd ?? d?.count ?? 0
    ));
    const totalCalc = vals.reduce((a: number, b: number) => a + b, 0);
    const mediaCalc = vals.length ? Math.round((totalCalc / vals.length) * 100) / 100 : 0;

    const totalPeriodo = this.pickNumber(payload, [
      'total_periodo',
      'totalPeriodo',
      'total',
      'dados.total_periodo',
      'dados.totalPeriodo',
      'dados.total',
      'dados.resumo.total_periodo',
      'dados.resumo.total',
      'totais.total_periodo',
      'totais.total',
      'summary.total',
      'resumo.total',
    ]) ?? payload?.kpis?.find?.((k: any) => /total/i.test(k?.label ?? ''))?.value;

    const mediaDiaria = this.pickNumber(payload, [
      'media',
      'media_diaria',
      'mediaDiaria',
      'dados.media',
      'dados.media_diaria',
      'dados.mediaDiaria',
      'dados.resumo.media',
      'dados.resumo.media_diaria',
      'dados.resumo.mediaDiaria',
      'totais.media',
      'summary.media',
      'resumo.media',
    ]) ?? payload?.kpis?.find?.((k: any) => /m[eé]dia/i.test(k?.label ?? ''))?.value;

    this.kpis.total = Number.isFinite(Number(totalPeriodo)) ? Number(totalPeriodo) : totalCalc;
    this.kpis.media = Number.isFinite(Number(mediaDiaria)) ? Number(mediaDiaria) : mediaCalc;
  }

  private recomputeMax() {
    this.maxValue = this.chartData.length
      ? Math.max(...this.chartData.map(p => Number(p.value) || 0))
      : 0;
  }

  barHeight(v: number): number {
    const val = Number(v) || 0;
    const top = this.scaleTop || Math.max(1, this.maxValue);
    const basePct = (val / top) * 100;
    const animatedPct = Math.round(basePct * this.animProgress);
    return Math.max(animatedPct, 2);
  }

  valueInside(v: number): boolean {
    const top = this.scaleTop || Math.max(1, this.maxValue);
    return (Number(v) / top) >= 0.70;
  }

  isTiny(v: number): boolean {
    const top = this.scaleTop || Math.max(1, this.maxValue);
    return (Number(v) / top) <= 0.03;
  }

  private buildYTicks() {
    const rawMax = Math.max(0, this.maxValue);
    if (rawMax <= 0) {
      this.yTicks = [0];
      this.scaleTop = 1;
      return;
    }
    const rounded = this.roundUpNice(rawMax);
    const top = Math.ceil(rounded * 1.08);
    this.scaleTop = top;

    const steps = 5;
    const step = Math.max(1, Math.ceil(top / steps));
    this.yTicks = Array.from({ length: steps + 1 }, (_, i) => i * step);
    this.yTicks[this.yTicks.length - 1] = top;
  }

  private roundUpNice(v: number): number {
    const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(1, v))));
    const d = v / pow10;
    let nice: number;
    if (d <= 1) nice = 1;
    else if (d <= 2) nice = 2;
    else if (d <= 5) nice = 5;
    else nice = 10;
    return nice * pow10;
  }

  trackByDate = (_: number, item: ChartPoint) => item.date;

  private startBarsAnimation() {
    if (this.animTimer) {
      clearInterval(this.animTimer);
      this.animTimer = undefined;
    }
    this.animProgress = 0;
    const steps = 40;
    let i = 0;
    this.animTimer = setInterval(() => {
      i++;
      this.animProgress = i / steps;
      if (i >= steps) {
        clearInterval(this.animTimer);
        this.animTimer = undefined;
        this.animProgress = 1;
      }
    }, 16);
  }

  // ======= Helpers =======
  private isValidHistoricalPoint(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;

    const dateKey = (obj.data ?? obj.date ?? obj.dia ?? obj.label);
    if (!dateKey || typeof dateKey !== 'string') return false;

    const rawVal =
      obj.total ??
      obj.value ??
      obj.quantidade ??
      obj.qtd ??
      obj.count;

    const num = Number(rawVal);
    return Number.isFinite(num);
  }

  /**
   * Extrai SOMENTE coleções históricas (>=2 pontos válidos).
   * Aceita: dados.historico, historico, dados.series, series, dados (array).
   * Evita: caminhos genéricos que capturam /hoje.
   */
  private extractSeries(payload: any): any[] {
    const candidates: any[] = [];

    // candidatos explícitos
    if (Array.isArray(payload?.dados?.historico)) candidates.push(payload.dados.historico);
    if (Array.isArray(payload?.historico)) candidates.push(payload.historico);
    if (Array.isArray(payload?.dados?.series)) candidates.push(payload.dados.series);
    if (Array.isArray(payload?.series)) candidates.push(payload.series);

    // alguns backends retornam direto em `dados` como array de pontos
    if (Array.isArray(payload?.dados)) candidates.push(payload.dados);

    // avalia cada candidato
    for (const arr of candidates) {
      const filtered = arr.filter((it: any) => this.isValidHistoricalPoint(it));
      // só considera histórico se houver ao menos 2 pontos válidos
      if (filtered.length >= 2) return filtered;
    }

    // nada válido
    return [];
  }

  private pickNumber(source: any, paths: string[]): number | undefined {
    for (const path of paths) {
      const value = path.split('.').reduce<any>((acc, key) => acc?.[key], source);
      if (value === null || value === undefined) continue;
      const num = Number(value);
      if (!Number.isNaN(num)) return num;
    }
    return undefined;
  }

  private parseToday(payload: any): { total: number; timestamp: string } {
    const candidates = [
      payload?.hoje,
      payload?.dados?.hoje,
      payload?.today,
      payload?.totais?.hoje,
      payload?.resumo?.hoje,
      payload, // fallback
    ].filter(Boolean);

    for (const node of candidates) {
      const total = this.pickNumber(node, [
        'total',
        'totalHoje',
        'valor',
        'value',
        'quantidade',
      ]);

      if (total !== undefined) {
        const timestamp =
          node?.data ??
          node?.dataHora ??
          node?.data_atualizacao ??
          node?.updated_at ??
          node?.updatedAt ??
          node?.timestamp ??
          '';
        return { total: Number(total), timestamp };
      }
    }

    return { total: 0, timestamp: '' };
  }
}
