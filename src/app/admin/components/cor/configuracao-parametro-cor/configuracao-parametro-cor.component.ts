import { Configificacao } from '@/shared/models/comando-cor.model';
import { Device } from '@/shared/models/device';
import { Cor } from '@/shared/sincroled/models/cor.model';
import { Parametro } from '@/shared/sincroled/models/parametro.model';
import { CorService } from '@/shared/sincroled/services/cor.service';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PopoverModule } from 'primeng/popover';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ComandoSincronismoService, SincronismoEvento, SincronismoStatus } from '@/shared/services/ComandoSincronismoService';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Tipoconfiguracao } from '@/shared/sincroled/models/constantes/tipo-configuracao';
import { EFEITOS, TIPO_LED } from '@/shared/models/constantes/delegate-state';


@Component({
  selector: 'app-configuracao-parametro-cor',
  imports: [
    CommonModule,
    FormsModule,
    PopoverModule,
    SliderModule,
    DialogModule,
    TableModule,
    TagModule,
    ButtonModule,
    ColorPickerModule,
    TooltipModule
  ],
  templateUrl: './configuracao-parametro-cor.component.html',
  styleUrl: './configuracao-parametro-cor.component.scss'
})
export class ConfiguracaoParametroCorComponent implements OnInit {

  @Input({ required: true }) deviceId!: string;
  @Input({ required: true }) parametro: Parametro = new Parametro;
  @Input({ required: true }) cor?: Cor;
  @Input() icon = false;
  protected view = false;
  protected loading = false;

  private service = inject(ComandoSincronismoService);
  private messageService = inject(MessageService);
  private sub?: Subscription;

  private eventos = signal<SincronismoEvento[]>([]);
  private carregando = signal(false);
  private statusAtual = signal<SincronismoStatus>('AGUARDANDO');
  private erroMensagem = signal<string | null>(null);

  protected efeitosDisponiveis = EFEITOS;

  constructor(
    private readonly corService: CorService
  ) { }

  ngOnInit(): void {
    //  this.initForm();
  }


  // Converte Hexadecimal (#ffffff) para Array Numérico RGB [255, 255, 255]
  hexToRgbArray(hex: string): number[] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  // Processa o submit do formulário montando o payload exatamente no padrão esperado
  salvarConfiguracoes() {
    this.loading = true

    this.parametro.cor = [];

    this.parametro.corHexa.forEach(hexa => {
      this.parametro.cor.push(...this.hexToRgbArray(hexa))
    })

    this.corService.salvarParametro(this.deviceId, this.parametro).subscribe({
      next: () => {
        this.enviarComando();
      },
      complete: () => this.loading = false,
      error: () => this.loading = false
    })
  }

  salvarVelocidade() {
    this.loading = true

    if (this.cor)
      this.corService.salvarVelocidade(this.cor).subscribe({
        next: () => {
          this.enviarComando();
        },
        complete: () => this.loading = false,
        error: () => this.loading = false
      })
  }


  deletarConfiguracao(id: string) {
    console.log('Deletando config:', id);
  }

  editarConfiguracao(config: Cor) {
    console.log('Editando config:', config.nome);
  }

  enviarComando(): void {
    this.eventos.set([]);
    this.erroMensagem.set(null);
    this.carregando.set(true);
    this.statusAtual.set('ENVIANDO');

    if (!this.deviceId)
      return;

    this.sub = this.service.enviarComando(this.deviceId, Tipoconfiguracao.LED).subscribe({
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
