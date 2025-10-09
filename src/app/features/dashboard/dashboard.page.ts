import { Component, signal } from '@angular/core';
import { DashboardService, Preset } from '../../services/dashboard/dashboard.service';

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
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage {
  // ======= STATE (alinhado ao seu HTML) =======
  headerSubtitle = '7 dias';
  rangePreset = 7 as 7 | 15 | 30;
  startDate?: string;
  endDate?: string;

  mode = signal<Mode>('preset');
  isLoading = signal<boolean>(false);
  errorMsg = '';

  // KPIs
  todayTotal = 0;
  kpis: Kpis = { media: 0, total: 0 };
  lastUpdate = '';

  // Tooltip/Modal simples do "Totais hoje"
  showTodayInfo = false;

  // Skeleton rows (apenas visual)
  skeletonRows = Array.from({ length: 6 });

  // ======= GRÁFICO =======
  chartData: ChartPoint[] = [];
  yTicks: number[] = [];
  private maxValue = 0;       // valor máximo real da série
  private scaleTop = 0;       // topo "amigável" (max arredondado + headroom)

  // ======= Animação (sem mudar HTML) =======
  // animProgress vai de 0 → 1 e é aplicado dentro do barHeight()
  private animProgress = 1;
  private animTimer: any;

  constructor(private dashboardService: DashboardService) {}

  // ======= CICLO DE VIDA =======
  ngOnInit() {
    this.setPreset(7); // carrega 7 dias por padrão
  }

  // ======= UI =======
  toggleTodayInfo() {
    this.showTodayInfo = !this.showTodayInfo;
  }

  dLabel(dateStr: string): string {
    // "2025-09-27" -> "27/09"
    const [y, m, d] = (dateStr || '').split('-');
    if (!y || !m || !d) return dateStr;
    return `${d}/${m}`;
  }

  // ======= FORMATAÇÃO DE HORA =======
  private formatTimeOnly(dateTimeStr: string): string {
    if (!dateTimeStr) return '';
    
    const date = new Date(dateTimeStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }

  // ======= PRESETS / CUSTOM RANGE =======
  setPreset(days: 7 | 15 | 30) {
    this.mode.set('preset');
    this.rangePreset = days;
    this.headerSubtitle = `${days} dias`;
    this.fetchAllForPreset(days);
  }

  applyCustom() {
    if (!this.startDate || !this.endDate) return;
    this.mode.set('custom');
    this.headerSubtitle = 'período customizado';
    this.fetchAllForCustom(this.startDate, this.endDate);
  }

  exportCsv() {
    // manter sua implementação atual (se houver)
  }

  // ======= FETCH usando getByPreset / getByCustom =======
  private fetchAllForPreset(days: 7 | 15 | 30) {
    this.isLoading.set(true);
    this.errorMsg = '';

    // Série de dias (7/15/30)
    this.dashboardService.getByPreset(days as Preset).subscribe({
      next: (res: any) => {
        this.applyPayload(res);         // <-- usa payload.dados[]
        this.applyKPIsFromPayload(res); // <-- usa total_periodo (fallback: calcula)
      },
      error: () => {
        this.errorMsg = 'Erro ao carregar o gráfico.';
      }
    });

    // Totais de HOJE (endpoint separado)
    this.dashboardService.getByPreset('hoje').subscribe({
      next: (resHoje: any) => {
        // /hoje -> { data: "YYYY-MM-DD", total: number }
        this.todayTotal = Number(resHoje?.total ?? 0);
        this.lastUpdate = this.formatTimeOnly(resHoje?.data ?? '');
      },
      error: () => {},
      complete: () => this.isLoading.set(false)
    });
  }

  private fetchAllForCustom(fromISO: string, toISO: string) {
    this.isLoading.set(true);
    this.errorMsg = '';

    // Série customizada
    this.dashboardService.getByCustom(fromISO, toISO).subscribe({
      next: (res: any) => {
        this.applyPayload(res);
        this.applyKPIsFromPayload(res);

        // Mantém "hoje" separado para o card da esquerda
        this.dashboardService.getByPreset('hoje').subscribe({
          next: (resHoje: any) => {
            this.todayTotal = Number(resHoje?.total ?? 0);
            this.lastUpdate = this.formatTimeOnly(resHoje?.data ?? '');
          },
          error: () => {},
          complete: () => this.isLoading.set(false)
        });
      },
      error: () => {
        this.errorMsg = 'Erro ao carregar o gráfico.';
        this.isLoading.set(false);
      }
    });
  }

  // ======= NORMALIZAÇÃO + ESCALA =======
  /** Converte o payload do back para o formato usado no template do gráfico. */
  applyPayload(payload: any) {
    // Back retorna: { periodo, total_periodo, dados: [{data,total}, ...] }
    const raw = Array.isArray(payload?.dados) ? payload.dados : [];

    // ordena por data (defensivo)
    raw.sort((a: any, b: any) => {
      const ta = new Date(a?.data ?? 0).getTime();
      const tb = new Date(b?.data ?? 0).getTime();
      return ta - tb;
    });

    this.chartData = raw.map((d: any) => ({
      date: d?.data ?? '',
      value: Number(d?.total ?? 0)
    }));

    this.recomputeMax();
    this.buildYTicks();

    // Reinicia e dispara a animação de crescimento (0% -> 100%)
    this.startBarsAnimation();
  }

  /** Preenche KPIs a partir do payload (usa total_periodo; fallback: calcula da série). */
  private applyKPIsFromPayload(payload: any) {
    const raw = Array.isArray(payload?.dados) ? payload.dados : [];
    const vals = raw.map((d: any) => Number(d?.total ?? 0));
    const totalCalc = vals.reduce((a: number, b: number) => a + b, 0);
    const mediaCalc = vals.length ? Math.round((totalCalc / vals.length) * 100) / 100 : 0;

    this.kpis.total = Number.isFinite(payload?.total_periodo) ? Number(payload.total_periodo) : totalCalc;
    this.kpis.media = Number.isFinite(payload?.media) ? Number(payload.media) : mediaCalc;
  }

  private recomputeMax() {
    this.maxValue = this.chartData.length
      ? Math.max(...this.chartData.map(p => Number(p.value) || 0))
      : 0;
  }

  /** Altura da barra em % (com mínimo visível) + fator de animação. */
  barHeight(v: number): number {
    const val = Number(v) || 0;
    const top = this.scaleTop || Math.max(1, this.maxValue); // usa topo "amigável"
    const basePct = (val / top) * 100;
    const animatedPct = Math.round(basePct * this.animProgress);
    return Math.max(animatedPct, 2); // mínimo 2% para não "sumir"
  }

  /** Quando a barra é suficientemente alta, o valor pode ficar "dentro" */
  valueInside(v: number): boolean {
    const top = this.scaleTop || Math.max(1, this.maxValue);
    return (Number(v) / top) >= 0.70; // >= 70% da altura total (aumentado de 32% para 70%)
  }

  /** Marca barras muito pequenas para suavizar/ocultar o rótulo */
  isTiny(v: number): boolean {
    const top = this.scaleTop || Math.max(1, this.maxValue);
    return (Number(v) / top) <= 0.03; // <= 3% da altura (reduzido para mostrar mais valores)
  }

  /** Gera ticks do eixo Y (0..topo) com ~5 intervalos e headroom de ~8%. */
  private buildYTicks() {
    const rawMax = Math.max(0, this.maxValue);
    if (rawMax <= 0) {
      this.yTicks = [0];
      this.scaleTop = 1;
      return;
    }

    // headroom: arredonda para cima e dá ~8% de folga
    const rounded = this.roundUpNice(rawMax);
    const top = Math.ceil(rounded * 1.08);
    this.scaleTop = top;

    // ~5 intervalos
    const steps = 5;
    const step = Math.max(1, Math.ceil(top / steps));
    this.yTicks = Array.from({ length: steps + 1 }, (_, i) => i * step);

    // garante que o último seja exatamente o topo
    this.yTicks[this.yTicks.length - 1] = top;
  }

  /** Arredonda para um número "bonito" (1, 2, 5 x 10^n) acima do valor. */
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

  /** trackBy para performance no *ngFor das barras. */
  trackByDate = (_: number, item: ChartPoint) => item.date;

  // ======= Animação auxiliar =======
  private startBarsAnimation() {
    // limpa animação anterior, se houver
    if (this.animTimer) {
      clearInterval(this.animTimer);
      this.animTimer = undefined;
    }

    this.animProgress = 0;

    // 40 steps * 16ms ~ 640ms (alinha com o transition do CSS ~650ms)
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
}