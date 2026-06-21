import {
  Component,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ComandoSincronismoService, SincronismoEvento, SincronismoStatus } from '@/shared/services/ComandoSincronismoService';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '@/core/auth/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-sincronizar-todos',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    CardModule,
    ScrollPanelModule,
    TableModule,
    TagModule
  ],
  templateUrl: './sincronizar-todos.component.html',
  styleUrl: './sincronizar-todos.component.scss'
})
export class SincronizarTodosComponent {


  private comandoService = inject(ComandoSincronismoService);
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

  public iniciarMonitoramento(): void {
    this.conectado.set(true);


    this.debugSubscription = this.comandoService.sincronizarTodos().subscribe({
      next: (novoEvento: SincronismoEvento) => {
        this.logs.update(listaAtual => [novoEvento, ...listaAtual]);
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
