import { Configificacao } from '@/shared/models/comando-cor.model';
import { EFEITOS, TIPO_LED } from '@/shared/models/constantes/delegate-state';
import { Device } from '@/shared/models/device';
import { ComandoSincronismoService, SincronismoEvento, SincronismoStatus } from '@/shared/services/ComandoSincronismoService';
import { Tipoconfiguracao } from '@/shared/sincroled/models/constantes/tipo-configuracao';
import { Cor } from '@/shared/sincroled/models/cor.model';
import { CorService } from '@/shared/sincroled/services/cor.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PopoverModule } from 'primeng/popover';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configuracao-cor-porta',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule,
    SliderModule,
    DialogModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './configuracao-cor-porta.component.html',
  styleUrl: './configuracao-cor-porta.component.scss'
})
export class ConfiguracaoCorPortaComponent implements OnInit {

  @Input({ required: true }) deviceId?: string;
  @Input({ required: true }) cor: any;
  @Input() icon = false;
  @Output() onSalve = new EventEmitter<void>();
  deviceForm!: FormGroup;
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
  protected tipoLed = TIPO_LED;

  constructor(
    private readonly corService: CorService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Inicializa a estrutura reativa do formulário baseado no JSON
  initForm() {
    this.deviceForm = this.fb.group({
      id: [this.cor?.id],
      nome: [this.cor?.nome, Validators.required],
      velocidade: [this.cor?.velocidade, [Validators.required, Validators.min(0), Validators.max(255)]],
      exclusiva: [this.cor?.exclusiva],
      vibracao: [this.cor?.vibracao],
      rapida: [this.cor?.rapida],
      responder: [this.cor?.responder],
      parametros: this.fb.array([])
    });

    // Popula o FormArray de parâmetros (Pinos)
    this.cor?.parametros?.forEach((param: any) => {
      this.parametros.push(this.criarParametroForm(param));
    });
  }

  // Getter auxiliar para facilitar o acesso ao FormArray no HTML
  get parametros(): FormArray {
    return this.deviceForm.get('parametros') as FormArray;
  }

  // Estrutura interna de cada pino/porta de cor
  private criarParametroForm(param: any): FormGroup {
    return this.fb.group({
      id: [param?.id],
      pino: [param.pino],
      efeito: [param.efeito, Validators.required],
      corHexa: this.fb.array(param?.corHexa?.map((cor: string) => this.fb.control(cor))),
      correcao: this.fb.array(param?.correcao?.map((val: number) => this.fb.control(val))),
      leds: [param.leds, [Validators.required, Validators.min(1)]],
      intensidade: [param.intensidade, [Validators.required, Validators.min(0), Validators.max(255)]],
      faixa: [param.faixa],
      tipoCor: [param.tipoCor],
      ativo: [param.ativo]
    });
  }

  // Getter auxiliar para obter as cores de um pino específico
  getCoresHexa(pinoIndex: number): FormArray {
    return this.parametros.at(pinoIndex).get('corHexa') as FormArray;
  }

  getCorrecao(pinoIndex: number): FormArray {
    return this.parametros.at(pinoIndex).get('correcao') as FormArray;
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
    if (this.deviceForm.invalid) return;

    const formValues = this.deviceForm.value;

    // Reconstrói a estrutura achatada de cores RGB para cada pino
    formValues.parametros = formValues?.parametros?.map((param: any) => {
      const rgbAchatado: number[] = [];
      param.corHexa.forEach((hex: string) => {
        rgbAchatado.push(...this.hexToRgbArray(hex));
      });

      return {
        ...param,
        cor: rgbAchatado // Atualiza a propriedade "cor" com a lista achatada de inteiros
      };
    });

    const finalPayload = {
      ...formValues,
      quantidadePinos: formValues.parametros.length
    };

    this.corService.salvarParametros(formValues.parametros).subscribe({
      next: () => {
        this.onSalve.emit();
        this.enviarComando();
      },
      complete: () => this.loading = false,
      error: () => this.loading = false
    })
  }


  salvarVelocidade(){

    const formValues = this.deviceForm.value;
     this.corService.salvarVelocidade(formValues).subscribe({
      next: () => {
        this.onSalve.emit();
        this.enviarComando();
      },
      complete: () => this.loading = false,
      error: () => this.loading = false
    })
  }

  getBgColorClass(colorName: string): string {
    switch (colorName.toLowerCase()) {
      case 'red': return 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'green': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
      case 'blue': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
      default: return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    }
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

    this.sub = this.service.enviarComando(this.deviceId, Tipoconfiguracao.MCU).subscribe({
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
