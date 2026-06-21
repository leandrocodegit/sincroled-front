import { Agenda, AgendaRequest } from '@/shared/sincroled/models/agenda.model';
import { Cor } from '@/shared/sincroled/models/cor.model';
import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';
import { CorService } from '@/shared/sincroled/services/cor.service';
import { DispositivoService } from '@/shared/sincroled/services/dispositivo.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { SelecaoDispositivoComponent } from '../../dispositivo/selecao-dispositivo/selecao-dispositivo.component';
import { AgendaService } from '@/shared/sincroled/services/agenda.service';
import { AuthService } from '@/core/auth/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-formulario-agenda',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SliderModule,
    ButtonModule,
    CardModule,
    InputNumberModule,
    InputTextModule,
    DialogModule,
    SelectModule,
    TooltipModule,
    DatePickerModule,
    PopoverModule,
    MultiSelectModule,
    SelecaoDispositivoComponent
  ],
  templateUrl: './formulario-agenda.component.html',
  styleUrl: './formulario-agenda.component.scss'
})
export class FormularioAgendaComponent {

  @Input() agendaParaEditar?: Agenda;
  @Input() perfisCorDisponiveis: Cor[] = [];
  @Input() outlined = false;
  @Input() icon = false;

  @Output() onSalve = new EventEmitter<void>();
  @Output() aoCancelar = new EventEmitter<void>();

  protected agendaForm!: FormGroup;
  protected isEdicao = false;
  protected loading = false;
  protected devices: Dispositivo[] = [];
  protected selecionados: Dispositivo[] = [];

  constructor(private fb: FormBuilder,
    private readonly agendaService: AgendaService,
    private readonly corService: CorService,
    public readonly authService: AuthService,
    private dispositivoService: DispositivoService) { }

  ngOnInit(): void {
    this.isEdicao = !!this.agendaParaEditar;

    if (this.agendaParaEditar?.dispositivos)
      this.selecionados = this.agendaParaEditar?.dispositivos
    this.initForm();
    this.listaCores();
  }


  listarDispositivos() {
    this.dispositivoService.listaTodosDispositivos().subscribe(response => {
      this.devices = response.content;
    })
  }

  listaCores() {
    this.loading = true;
    this.corService.listaCores().subscribe({
      next: response => {
        this.perfisCorDisponiveis = response.content;
      },
      error: () => this.loading = false,
      complete: () => this.loading = false
    })
  }

  removerDispositivo(id: any) {

  }

  limparTodosDispositivos() {

  }

  selecionarDevices(devices: Dispositivo[]) {
    this.selecionados = devices;
    this.agendaForm.get('dispositivosIdsStr')?.setValue(this.selecionados.map(device => device.id))
  }

  private initForm(): void {
    // Tratamento de datas caso seja edição
    let periodoInicial: Date[] = [];
    if (this.agendaParaEditar?.inicio && this.agendaParaEditar?.termino) {
      periodoInicial = [
        new Date(this.agendaParaEditar.inicio),
        new Date(this.agendaParaEditar.termino)
      ];
    }

    const disabled = !this.authService.isPermiteEditarAgenda();

    this.agendaForm = this.fb.group({
      nome: [
        { value: this.agendaParaEditar?.nome || '', disabled },
        [Validators.required, Validators.minLength(3)]
      ],
      periodo: [
        { value: periodoInicial, disabled },
        Validators.required
      ],
      cor: [
        { value: this.agendaParaEditar?.cor?.id || '', disabled },
        Validators.required
      ],
      ativo: [
        { value: this.agendaParaEditar?.ativo ?? false, disabled }
      ],
      executarAnualmente: [
        { value: this.agendaParaEditar?.executarAnualmente ?? false, disabled }
      ],
      todos: [
        { value: this.agendaParaEditar?.todos ?? false, disabled }
      ],
      dispositivosIdsStr: [
        { value: this.agendaParaEditar?.dispositivos?.join(', ') || '', disabled }
      ]
    });

    // Escuta mudanças no checkbox "todos" para resetar ou validar os IDs de hardware
    this.agendaForm.get('todos')?.valueChanges.subscribe((todosAtivo) => {
      const dispControl = this.agendaForm.get('dispositivosIdsStr');
      if (todosAtivo) {
        dispControl?.clearValidators();
        dispControl?.setValue('');
      } else {
        dispControl?.setValidators(Validators.required);
      }
      dispControl?.updateValueAndValidity();
    });
  }

  salvar(): void {
    if (this.agendaForm.invalid) return;

    const formValues = this.agendaForm.value;
    const [dataInicio, dataFim] = formValues.periodo;

    const agendaFormatada = new AgendaRequest({
      id: this.agendaParaEditar?.id,
      nome: formValues.nome,
      ativo: formValues.ativo,
      inicio: this.formatarData(dataInicio),
      termino: this.formatarData(dataFim || dataInicio),
      todos: formValues.todos,
      executarAnualmente: formValues.executarAnualmente,
      dispositivos: this.selecionados.map(device => device.id),
      cor: { id: formValues.cor }
    });

    let operacao = this.agendaService.criarAgenda(agendaFormatada);

    if (this.agendaParaEditar?.id)
      operacao = this.agendaService.alterarAgenda(agendaFormatada, true);

    operacao.subscribe({
      next: () => {
        this.onSalve.emit();
        this.view = false;
      },
      error: () => this.loading = false,
      complete: () => this.loading = false
    });
  }

  // Auxiliar para formatar datas para YYYY-MM-DD local sem desvio de fuso horário
  private formatarData(date: Date): string {
    if (!date) return '';
    const z = (n: number) => (n < 10 ? '0' : '') + n;
    return `${date.getFullYear()}-${z(date.getMonth() + 1)}-${z(date.getDate())}`;
  }
  @Input() showDetalhes = false;
  protected corLoad = false;
  protected salvando = false;
  protected view = false;

  protected cores: Cor[] = [];

  listaAgendas() {

  }

  cancelar() {

  }

  confirmarAlteracao() { }

}
