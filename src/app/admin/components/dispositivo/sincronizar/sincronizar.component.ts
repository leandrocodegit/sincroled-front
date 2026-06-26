import {
  Component,
  signal,
  inject,
  OnDestroy,
  Input,
} from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { ComandoSincronismoService, SincronismoEvento, SincronismoStatus } from '@/shared/services/ComandoSincronismoService';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '@/core/auth/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Tipoconfiguracao } from '@/shared/sincroled/models/constantes/tipo-configuracao';

@Component({
  selector: 'app-sincronismo',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NgClass,
    ButtonModule,
    DialogModule,
    ToastModule
  ],
  templateUrl: './sincronizar.component.html',
})
export class SincronizarComponent implements OnDestroy {

  @Input({ required: true }) deviceId?: string;

  private service = inject(ComandoSincronismoService);
  private messageService = inject(MessageService);
  public authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private sub?: Subscription;
  protected view = false;

  protected eventos = signal<SincronismoEvento[]>([]);
  protected carregando = signal(false);
  protected statusAtual = signal<SincronismoStatus>('AGUARDANDO');
  protected erroMensagem = signal<string | null>(null);

  /**
   * Fluxo de status esperado:
   *   ENVIANDO → OK (device recebeu, stream ainda aberto) → SUCESSO | WARN | ERROR | TIMEOUT
   *
   * O botão permanece desabilitado enquanto carregando() === true,
   * inclusive durante o estado OK (ainda aguardando processamento).
   */

  reset() {
    this.confirmationService.confirm({
      message: 'Isso irá limpar a memória do modulo!',
      header: 'Confirmar ação',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-trash',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'danger',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Sim, Remover',
      },
      accept: () => {
       this.enviarComando(Tipoconfiguracao.LIMPAR_FLASH);
      }
    });
  }

  enviarComando(tipoConfiguracao?: any): void {
    this.eventos.set([]);
    this.erroMensagem.set(null);
    this.carregando.set(true);
    this.statusAtual.set('ENVIANDO');

    if (!this.deviceId)
      return;

    this.sub = this.service.enviarComando(this.deviceId, tipoConfiguracao).subscribe({
      next: (evento) => {
        this.eventos.update((lista) => [...lista, evento]);
        this.statusAtual.set(evento.status);
        this.messageService.add(evento.toast);
      },
      error: (e: SincronismoEvento) => {
        this.carregando.set(false);
        this.statusAtual.set(e.status);  // TIMEOUT | ERROR

        this.eventos.update((lista) => {
          const jaExiste = lista.some(
            (ev) => ev.status === e.status && ev.mensagem === e.mensagem
          );
          return jaExiste ? lista : [...lista, e];
        });

        if (e.status === 'ERROR') {
          this.erroMensagem.set(e.mensagem);
          this.messageService.add(e.toast);
        }
      },
      complete: () => {
        this.carregando.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
