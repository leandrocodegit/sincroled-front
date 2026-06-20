import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';
import { DispositivoService } from '@/shared/sincroled/services/dispositivo.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { PasswordModule } from 'primeng/password';
import { ComandoSincronismoService, SincronismoEvento, SincronismoStatus } from '@/shared/services/ComandoSincronismoService';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Tipoconfiguracao } from '@/shared/sincroled/models/constantes/tipo-configuracao';
import { NivelWIFIComponent } from '../nivel-wifi/nivel-wifi.component';
import { AuthService } from '@/core/auth/services/auth.service';


@Component({
  selector: 'app-configurar-wifi',
  imports: [
    CommonModule,
    FormsModule,
    SliderModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    PopoverModule,
    SelectModule,
    TooltipModule,
    NivelWIFIComponent
  ],
  templateUrl: './configurar-wifi.component.html',
  styleUrl: './configurar-wifi.component.scss'
})
export class ConfigurarWifiComponent {
  @Input({ required: true }) device!: Dispositivo;
  @Input() showDetalhes = false;

  // Emite o objeto modificado ao salvar
  @Output() onSave = new EventEmitter<Dispositivo>();
  @Output() onCancel = new EventEmitter<void>();

  private service = inject(ComandoSincronismoService);
  protected authService = inject(AuthService);
  private messageService = inject(MessageService);
  private sub?: Subscription;
  protected view = false;

  private eventos = signal<SincronismoEvento[]>([]);
  private carregando = signal(false);
  private statusAtual = signal<SincronismoStatus>('AGUARDANDO');
  private erroMensagem = signal<string | null>(null);

  salvando: boolean = false;
  protected conexao: {
    habilitarWifi: boolean,
    ssid: string,
    senha: string
  } = {
      habilitarWifi: false,
      ssid: '',
      senha: ''
    }

  constructor(
    private readonly dispositivoService: DispositivoService
  ) { }

  ngOnInit(): void {
    if (this.device?.conexao) {
      this.conexao = {
        ...(this.device.conexao),
        senha: '**********************'
      }
    }
  }

  confirmarAlteracao(): void {
    this.salvando = true;

    this.dispositivoService.salvarConfiguracaoWifi(this.device.id, this.conexao).subscribe({
      next: () => {
        this.salvando = false;
        this.enviarComando()
      },
      error: () => this.salvando = false
    });

  }

  cancelar(): void {
    this.onCancel.emit();
  }

  enviarComando(): void {
    this.eventos.set([]);
    this.erroMensagem.set(null);
    this.carregando.set(true);
    this.statusAtual.set('ENVIANDO');

    if (!this.device.id)
      return;

    this.sub = this.service.enviarComando(this.device.id, Tipoconfiguracao.WIFI).subscribe({
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
