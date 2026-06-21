import { TIPO_LED } from '@/shared/models/constantes/delegate-state';
import { ComandoSincronismoService, SincronismoEvento, SincronismoStatus } from '@/shared/services/ComandoSincronismoService';
import { Tipoconfiguracao } from '@/shared/sincroled/models/constantes/tipo-configuracao';
import { Cor } from '@/shared/sincroled/models/cor.model';
import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';
import { CorService } from '@/shared/sincroled/services/cor.service';
import { DispositivoService } from '@/shared/sincroled/services/dispositivo.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-alterar-tipo-cor',
  imports: [
    CommonModule,
    FormsModule,
    SliderModule,
    ButtonModule,
    CardModule,
    InputNumberModule,
    PopoverModule,
    SelectModule,
    TooltipModule,
    CheckboxModule
  ],
  templateUrl: './alterar-tipo-cor.component.html',
  styleUrl: './alterar-tipo-cor.component.scss'
})
export class AlterarTipoCorComponent {
  @Input({ required: true }) device!: Dispositivo;
  @Input() showDetalhes = false;

  // Emite o objeto modificado ao salvar
  @Output() onSave = new EventEmitter<Dispositivo>();
  @Output() onCancel = new EventEmitter<void>();

  // Armazena o valor local para manipulação do formulário
  valorSensibilidade: number = 0;
  salvando: boolean = false;
  protected cores: Cor[] = [];
  protected corLoad = false;
  protected tipoLed = TIPO_LED;

  private service = inject(ComandoSincronismoService);
  private messageService = inject(MessageService);
  private sub?: Subscription;
  protected view = false;

  private eventos = signal<SincronismoEvento[]>([]);
  private carregando = signal(false);
  private statusAtual = signal<SincronismoStatus>('AGUARDANDO');
  private erroMensagem = signal<string | null>(null);


  constructor(
    private readonly dispositivoService: DispositivoService
  ) { }


  confirmarAlteracao(): void {
    this.salvando = true;

    this.dispositivoService.salvarConfiguracao(this.device).subscribe({
      next: () => {
        this.salvando = false;
        this.enviarComando();
      },
      error: () => this.salvando = false
    });

  }

  cancelar(): void {
    this.onCancel.emit();
  }

 private enviarComando(): void {
    this.eventos.set([]);
    this.erroMensagem.set(null);
    this.carregando.set(true);
    this.statusAtual.set('ENVIANDO');

    if (!this.device.id)
      return;

    this.sub = this.service.enviarComando(this.device.id).subscribe({
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
