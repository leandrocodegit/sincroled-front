import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Paginator, PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { Popover, PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';

import { TabelaService } from './tabela.service';
import { IdentityService } from '../../services/identity.service';
import { AuthService } from '@/core/auth/services/auth.service';

// ─── Tipos locais ──────────────────────────────────────────────────────────────

export interface TabelaColuna {
  header: string;
  field:  string;
  [key: string]: any;
}

type HttpSeverity = 'success' | 'warn' | 'danger';

// ─── Intervalo do popover de cópia ────────────────────────────────────────────

const COPIAR_HIDE_DELAY_MS = 1500;

@Component({
  selector: 'app-tabela',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    FormsModule,
    TagModule,
    PaginatorModule,
    SelectModule,
    DatePipe,
    PopoverModule,
    MessageModule,
    ButtonModule,
    ClipboardModule,
    TooltipModule,
    InputText
  ],
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.scss'
})
export class TabelaComponent {

  // ─── Inputs ───────────────────────────────────────────────────────────────

  @Input() itens: any[]         = [];
  @Input() cols:  TabelaColuna[] = [];
  @Input() view:  any;
  @Input() auth:  any;
  @Input() page:  PaginatorState = { rows: 10, first: 0 };

  // ─── Outputs ──────────────────────────────────────────────────────────────

  @Output() editarEmit       = new EventEmitter<any>();
  @Output() detalhesEmit     = new EventEmitter<any>();
  @Output() excluirEmit      = new EventEmitter<any>();
  @Output() visualizarEmit   = new EventEmitter<any>();
  @Output() pageEmit         = new EventEmitter<PaginatorState>();
  @Output() logoutEmit       = new EventEmitter<{ id: any; firstName: any }>();
  @Output() lockEmit         = new EventEmitter<any>();
  @Output() refreshEmit      = new EventEmitter<any>();
  @Output() configEmit       = new EventEmitter<any>();
  @Output() stopEmit         = new EventEmitter<any>();
  @Output() playEmit         = new EventEmitter<any>();
  @Output() jsonEmit         = new EventEmitter<any>();
  @Output() downloadEmit     = new EventEmitter<any>();
  @Output() duplicarEmit     = new EventEmitter<any>();
  @Output() deployEmit       = new EventEmitter<any>();
  @Output() plusEmit         = new EventEmitter<any>();
  @Output() alertEmit        = new EventEmitter<any>();
  @Output() statusEmit       = new EventEmitter<any>();
  @Output() grupoUsuarioEmit = new EventEmitter<any>();
  @Output() plusHeadEmit     = new EventEmitter<void>();
  @Output() search           = new EventEmitter<any>();

  // ─── ViewChildren ─────────────────────────────────────────────────────────

  @ViewChild('tabela') tabela?: Table;
  @ViewChild('op')     op!: Popover;

  // ─── Injeções ─────────────────────────────────────────────────────────────

  public  readonly identity    = inject(IdentityService);
  public  readonly authService = inject(AuthService);
  private readonly tabelaService = inject(TabelaService);
  private readonly destroyRef    = inject(DestroyRef);

  // ─── Estado ───────────────────────────────────────────────────────────────

  protected globalFields: string[]  = [];
  protected active   = false;
  protected pesquisa = '';
  protected first    = 0;
  protected rows     = 10;

  /** Timer do popover de cópia — limpo se o componente for destruído antes do delay. */
  private copiarIntervalo?: ReturnType<typeof setInterval>;

  // ─── Inicialização das subscriptions ──────────────────────────────────────

  constructor() {
    /**
     * As subscriptions são iniciadas no construtor pois dependem de
     * tabelaService, mas usam takeUntilDestroyed(destroyRef) para
     * cancelamento automático — sem necessidade de OnDestroy manual.
     *
     * O acesso ao @ViewChild `tabela` é protegido por guards opcionais
     * (tabela?.) pois o ViewChild pode ser undefined antes da view iniciar.
     */
    this.tabelaService.active$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.onActiveChange(value));

    this.tabelaService.search$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.onSearchChange(value));
  }

  // ─── Handlers de filtro ───────────────────────────────────────────────────

  private onActiveChange(value: any): void {
    if (!this.tabela) return;

    const field = value?.field ?? 'enabled';

    if (value?.value) {
      this.tabela.filters[field] = { value: value.value, matchMode: 'equals' };
    } else {
      delete this.tabela.filters[field];
    }

    this.tabela._filter();

    if (this.pesquisa) {
      this.tabela.filterGlobal(this.pesquisa, 'contains');
    }

    this.active = value;
  }

  private onSearchChange(value: string): void {
    if (!this.tabela) return;

    this.pesquisa = value;

    if (this.active) {
      this.tabela.filters['enabled'] = { value: this.active, matchMode: 'equals' };
      this.tabela._filter();
    }

    this.tabela.filterGlobal(value, 'contains');
  }

  // ─── Paginação ────────────────────────────────────────────────────────────

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows  = event.rows  ?? 10;
    this.pageEmit.emit(event);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  getField(): string[] {
    return this.cols.filter(col => col?.field).map(col => col.field);
  }

  getSeverity(value: number): HttpSeverity {
    if (value >= 200 && value < 300) return 'success';
    if (value >= 400 && value < 500) return 'warn';
    return 'danger';
  }

  /**
   * Abre o popover de confirmação de cópia e o fecha automaticamente
   * após COPIAR_HIDE_DELAY_MS. Limpa o intervalo anterior se o usuário
   * clicar mais de uma vez antes do delay expirar.
   */
  copiar(event: MouseEvent): void {
    this.op.toggle(event);

    if (this.copiarIntervalo) clearInterval(this.copiarIntervalo);

    this.copiarIntervalo = setInterval(() => {
      this.op.hide();
      clearInterval(this.copiarIntervalo);
      this.copiarIntervalo = undefined;
    }, COPIAR_HIDE_DELAY_MS);
  }

  // ─── Emitters de ação ─────────────────────────────────────────────────────

  editar(id: any):            void { this.editarEmit.emit(id); }
  excluir(id: any):           void { this.excluirEmit.emit(id); }
  detalhes(id: any):          void { this.detalhesEmit.emit(id); }
  refresh(value: any):        void { this.refreshEmit.emit(value); }
  visualizar(value: any):     void { this.visualizarEmit.emit(value); }
  lock(value: any):           void { this.lockEmit.emit(value); }
  config(value: any):         void { this.configEmit.emit(value); }
  stop(value: any):           void { this.stopEmit.emit(value); }
  play(value: any):           void { this.playEmit.emit(value); }
  download(value: any):       void { this.downloadEmit.emit(value); }
  pesquisar(value: any):      void { this.search.emit(value); }
  duplicar(value: any):       void { this.duplicarEmit.emit(value); }
  implantar(value: any):      void { this.deployEmit.emit(value); }
  adicionar(value: any):      void { this.plusEmit.emit(value); }
  adicionarGrupo(value: any): void { this.grupoUsuarioEmit.emit(value); }
  visualizarJson(value: any): void { this.jsonEmit.emit(value); }
  alert(value: any):          void { this.alertEmit.emit(value); }
  status(value: any):         void { this.statusEmit.emit(value); }
  headPlus():                 void { this.plusHeadEmit.emit(); }

  logout(id: any, firstName: any): void {
    this.logoutEmit.emit({ id, firstName });
  }
}
