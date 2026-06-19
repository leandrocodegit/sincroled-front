import { AuthService } from '@/core/auth/services/auth.service';
import { ComandoSincronismoService, SincronismoStatus } from '@/shared/services/ComandoSincronismoService';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { JsonHighlighterPipe } from '@/shared/pipes/JsonHighlighterPipe.pipe';

interface PayloadHardware {
  id: string;
  tipo: number;
  versao: string;
  modelo: string;
  mcu: boolean;
  wifi: boolean;
  eth: boolean;
  rssi: number;
  msg: string;
  conexao: number;
  efeito: number[];
  cor: any;
}

interface SincronismoEvento {
  status: 'SUCESSO' | 'ERROR' | 'TIMEOUT' | 'OK';
  mensagem: string;
  deviceId: string;
  timestamp: Date;
  payload?: {
    payload?: PayloadHardware; // Mapeia a estrutura aninhada recebida
  };
}

@Component({
  selector: 'app-debug-monitor',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    CardModule,
    ScrollPanelModule,
    TableModule,
    TagModule,
    JsonHighlighterPipe
  ],
  templateUrl: './debug-monitor.component.html',
  styleUrl: './debug-monitor.component.scss'
})
export class DebugMonitorComponent {

  @Input({ required: true }) deviceId?: string;

  private comandoService = inject(ComandoSincronismoService);
  private messageService = inject(MessageService);
  public authService = inject(AuthService);
  private debugSubscription?: Subscription;
  protected view = false;

  protected eventos = signal<SincronismoEvento[]>([]);
  protected carregando = signal(false);
  protected statusAtual = signal<SincronismoStatus>('AGUARDANDO');
  protected erroMensagem = signal<string | null>(null);
  public logs = signal<SincronismoEvento[]>([]);
  public logSelecionado = signal<SincronismoEvento | null>(null);
  public conectado = signal<boolean>(false);


  ngOnInit(): void {
  }

  public iniciarMonitoramento(): void {
    this.conectado.set(true);

    if(!this.deviceId)
      return;

    this.debugSubscription = this.comandoService.enviarDebug(this.deviceId).subscribe({
      next: (novoEvento: SincronismoEvento) => {
        // Alimenta a lista adicionando o log mais recente no topo do array
        this.logs.update(listaAtual => [novoEvento, ...listaAtual]);

        // Seleciona automaticamente o primeiro evento para o painel de inspeção
        if (!this.logSelecionado()) {
          this.logSelecionado.set(novoEvento);
        }
      },
      error: (err) => {
        console.error('Erro na Stream de Debug:', err);
        this.conectado.set(false);
      }
    });
  }

  public pararMonitoramento(): void {
    if (this.debugSubscription) {
      this.debugSubscription.unsubscribe();
    }
    this.conectado.set(false);
  }

  public selecionarLog(log: SincronismoEvento): void {
    this.logSelecionado.set(log);
  }

  public limparLogs(): void {
    this.logs.set([]);
    this.logSelecionado.set(null);
  }

  // Helper para formatar o JSON de forma indentada na tela
  public extrairEFormatarJson(log: SincronismoEvento | null): string {
    if (!log || !log.payload) return '{}';
    return JSON.stringify(log.payload, null, 2);
  }

  // Retorna a cor correspondente para as tags do PrimeNG baseado no RSSI (Sinal Wi-Fi)
  public obterSeveridadeRssi(rssi: number | undefined): 'success' | 'warn' | 'danger' | 'secondary' {
    if (!rssi) return 'secondary';
    if (rssi >= -60) return 'success';
    if (rssi >= -80) return 'warn';
    return 'danger';
  }

  ngOnDestroy(): void {
    this.pararMonitoramento();
  }

}
