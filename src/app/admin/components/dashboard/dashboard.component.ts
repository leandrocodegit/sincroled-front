import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/shared/services/layout.service';
import { DashboardService } from '@/shared/sincroled/services/dashboard.service';
import { Dashboard } from '@/shared/sincroled/models/dashboard.model';
import { Comando } from '@/shared/sincroled/models/constantes/comando';
import { DashboardItem } from '@/shared/sincroled/models/dashboard-item.model';
import { MqttService } from 'ngx-mqtt';
import { MqttAppModule } from '@/mqtt-app.module';
import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';

@Component({
  selector: 'app-iot-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    MqttAppModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  protected dashboardData?: Dashboard;

  // Chart data
  conexoesChartData: any;
  conexoesChartOptions: any;
  colorsChartData: any;
  colorsChartOptions: any;
  agendasChartData: any;
  agendasChartOptions: any;
  agendasExecucaoChartData: any;
  agendasExecucaoChartOptions: any;

  /** @deprecated use per-chart options — kept for compatibility */
  donutOptions: any;


  constructor(
    private readonly dashboardService: DashboardService,
    private readonly layoutService: LayoutService,
    private readonly mqttSevice: MqttService) { }

  ngOnInit(): void {
    this.buscarDash();
    this.mqttSevice.observe(`device/update/v2/#`).subscribe((message: any) => {

      const jsonString = String.fromCharCode(...message.payload);
      const payload = JSON.parse(jsonString) as Dispositivo[];

      if (payload?.length)
        this.buscarDash();
    });
  }


  buscarDash() {
    this.dashboardService.buscarDashboard().subscribe(response => {
      this.dashboardData = response;
      this.buildDonutOptions();
      this.initConexoesChart();
      this.initColorsChart();
      this.initAgendasChart();
      this.initAgendasExecucaoChart();
    })
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  getTaxaAtiva(): number {
    if (!this.dashboardData)
      return 0;
    const total = this.dashboardData.usuariosAtivos + this.dashboardData.usuariosInativos;
    return total === 0 ? 0 : Math.round((this.dashboardData.usuariosAtivos / total) * 100);
  }

  getConexaoPct(): number {
    if (!this.dashboardData)
      return 0;

    const { total, online } = this.dashboardData.dispositivos;
    return total === 0 ? 0 : Math.round((online / total) * 100);
  }

  getPercentualLogs(): string {
    if (!this.dashboardData?.logs || this.dashboardData.logsHoje == 0)
      return '0'
    return (this.dashboardData.logsHoje / this.dashboardData.logs.length * 100).toFixed(0);
  }

  getCorePct(quantidade: number, lista: DashboardItem[]): number {
    const total = lista.reduce((s, c) => s + c.quantidade, 0);
    return total === 0 ? 0 : Math.round((quantidade / total) * 100);
  }

  getNomeCor(hex: string): string {
    const map: Record<string, string> = {
      '#ff0000': 'Vermelho', '#0000ff': 'Azul', '#00ff00': 'Verde',
      '#ff00ae': 'Rosa', '#ffffff': 'Branco', '#000000': 'Preto',
      '#ffff00': 'Amarelo', '#0100fe': 'Azul',
    };
    return map[hex.toLowerCase()] ?? hex;
  }

  getNomeCorAgenda(): string {
    if (!this.dashboardData?.agendas)
      return '';
    if (!this.dashboardData.agendas.length) return '—';
    return this.getNomeCor(this.dashboardData.agendas[0].item).toUpperCase();
  }

  // ── Chart builders ───────────────────────────────────────────────────────

  /** Cria um novo objeto de options a cada chamada — obrigatório para o PrimeNG
   *  p-chart: compartilhar a mesma referência faz apenas o primeiro chart renderizar. */
  private makeDonutOptions(): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : '0';
              return ` ${ctx.raw} u. (${pct}%)`;
            }
          }
        }
      }
    };
  }

  /** @deprecated mantido para não quebrar template legado */
  private buildDonutOptions(): void {
    this.donutOptions = this.makeDonutOptions();
  }

  private buildDonutData(lista: DashboardItem[]) {

    if (!lista)
      return;

    const src = lista.length ? lista : [{ item: '#374151', quantidade: 1 }];
    return {
      labels: src.map(c => c.item),
      datasets: [{
        data: src.map(c => c.quantidade),
        backgroundColor: src.map(c => c.item),
        borderWidth: lista.length ? 2 : 0,
        borderColor: 'transparent',
        hoverBorderWidth: 0,
      }]
    };
  }

  initConexoesChart(): void {
    if (!this.dashboardData)
      return;
    const { online, offline } = this.dashboardData.dispositivos;
    this.conexoesChartData = {
      labels: ['Ativa', 'Inativa'],
      datasets: [{
        data: [online, offline],
        backgroundColor: ['#10b981', '#f87171'],
        borderWidth: 2,
        borderColor: 'transparent',
        hoverBorderWidth: 0,
      }]
    };
    this.conexoesChartOptions = this.makeDonutOptions();
  }

  initColorsChart(): void {
    if (!this.dashboardData)
      return;
    this.colorsChartData = this.buildDonutData(this.dashboardData.cores);
    this.colorsChartOptions = this.makeDonutOptions();
  }

  initAgendasChart(): void {
    if (!this.dashboardData)
      return;
    this.agendasChartData = this.buildDonutData(this.dashboardData.agendas);
    this.agendasChartOptions = this.makeDonutOptions();
  }

  initAgendasExecucaoChart(): void {
    if (!this.dashboardData)
      return;
    this.agendasExecucaoChartData = this.buildDonutData(this.dashboardData.agendasExecucao);
    this.agendasExecucaoChartOptions = this.makeDonutOptions();
  }

  getIcon(comando: Comando) {
    if (comando == Comando.SINCRONIZAR_TUDO)
      return 'pi pi-sync';
    if (comando == Comando.SINCRONIZAR)
      return 'pi pi-refresh';
    else if (comando == Comando.VIBRACAO)
      return 'pi pi-bolt';
    else if (comando == Comando.TIMER_CRIADO)
      return 'pi pi-clock';
    else if (comando == Comando.AGENDA_EXECUTADA)
      return 'pi pi-calendar';
    else if (comando == Comando.FIRMWARE)
      return 'pi pi-upload';
    else 'pi pi-check-circle';
  }

  getColor(comando: Comando) {
    if (comando == Comando.SINCRONIZAR_TUDO)
      return 'bg-teal-50 text-teal-600 border border-teal-100 dark:bg-teal-400/15 dark:text-teal-400 dark:border-none';
    if (comando == Comando.OCORRENCIA)
      return 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-400/15 dark:text-amber-400 dark:border-none';
    else if (comando == Comando.FIRMWARE)
      return 'bg-purple-50 text-purple-600 border border-amber-100 dark:bg-purple-400/15 dark:text-purple-400 dark:border-none';
    else if (comando == Comando.TIMER_CRIADO || comando == Comando.AGENDA_EXECUTADA)
      return 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-400/15 dark:text-red-400 dark:border-none';
    else '';
  }
}
