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
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configuracao-sensor',
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
  templateUrl: './configuracao-sensor.component.html',
  styleUrl: './configuracao-sensor.component.scss'
})
export class ConfiguracaoSensorComponent {


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

  private service = inject(ComandoSincronismoService);
  private messageService = inject(MessageService);
  private sub?: Subscription;
  protected view = false;

  private eventos = signal<SincronismoEvento[]>([]);
  private carregando = signal(false);
  private statusAtual = signal<SincronismoStatus>('AGUARDANDO');
  private erroMensagem = signal<string | null>(null);


  constructor(
    private readonly dispositivoService: DispositivoService,
    private readonly corService: CorService
  ) { }

  ngOnInit(): void {
    if (this.device) {
      this.valorSensibilidade = this.device.sensibilidadeVibracao;
    }
  }

  listaCores() {
    this.corLoad = true;
    this.corService.listaCores(['EVENTO', 'TODOS']).subscribe({
      next: response => {
        this.cores = response.content;
      },
      error: () => this.corLoad = false,
      complete: () => this.corLoad = false
    })
  }

  get labelPorcentagem(): string {
    return `${Math.round(this.device.sensibilidadeVibracao / 50 * 100)}%`;
  }

    get tempoPorcentagem(): string {
    return `${Math.round(this.device.tempoEvento / 255 * 100)}%`;
  }

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

  gerarListaDecimal(): number[] {
    const lista: number[] = [];
    const inicio = 0.05;
    const fim = 10.0;
    const passo = 0.01;

    // Usamos um loop baseado no número de iterações para evitar acúmulo de erro decimal
    // (10.0 - 0.05) / 0.01 = 995 iterações
    const totalIteracoes = Math.round((fim - inicio) / passo);

    for (let i = 0; i <= totalIteracoes; i++) {
      // Calculamos o valor multiplicando o índice para manter a precisão
      const valor = parseFloat((inicio + i * passo).toFixed(2));
      lista.push(valor);
    }

    return lista;
  }

  enviarComando(): void {
    this.eventos.set([]);
    this.erroMensagem.set(null);
    this.carregando.set(true);
    this.statusAtual.set('ENVIANDO');

    if (!this.device.id)
      return;

    this.sub = this.service.enviarComando(this.device.id, Tipoconfiguracao.MCU).subscribe({
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
