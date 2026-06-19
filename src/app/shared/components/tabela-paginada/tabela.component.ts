import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TabelaService } from '../tabela/tabela.service';
import { NumeroProtocoloComponent } from '../numero-protocolo/numero-protocolo.component';
import { IdentityService } from '@/shared/services/identity.service';

export interface TabelaColuna {
  header: string;
  field: string;
  subfield?: string;
  isSubfield?: boolean;
  isCopy?: boolean;
  isProtocolo?: boolean;
  isUserName?: boolean;
  isTime?: boolean;
  fieldObject?: string;
  isTagReverse?: boolean;
  isTag?: boolean;
  sort?: string
}

export interface TabelaPage {
  size: number;
  number: number;
  totalElements?: number;
}

export interface TabelaPageEmit {
  spring: {
    size: number;
    page: number;
    sort: string;
  };
  camunda: {
    maxResults: number;
    firstResult: number;
    sortBy: string;
    sortOrder: string;
  };
}

@Component({
  selector: 'app-tabela-paginada',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    FormsModule,
    TagModule,
    SelectModule,
    PopoverModule,
    MessageModule,
    ButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    DatePipe,
    ClipboardModule,
    TooltipModule,
    NumeroProtocoloComponent
  ],
  templateUrl: './tabela-paginada.component.html'
})
export class TabelaPagindaComponent implements OnInit {

  // ─── Inputs ───────────────────────────────────────────────────────────────

  @Input() itens: any[] = [];
  @Input() cols: TabelaColuna[] = [];
  @Input() view: any;
  @Input() page: TabelaPage = { size: 10, number: 0 };
  @Input() totalElements?: number;

  // ─── Outputs ──────────────────────────────────────────────────────────────

  @Output() editarEmit = new EventEmitter<any>();
  @Output() excluirEmit = new EventEmitter<any>();
  @Output() visualizarEmit = new EventEmitter<any>();
  @Output() pageEmit = new EventEmitter<TabelaPageEmit>();
  @Output() logoutEmit = new EventEmitter<{ id: any; firstName: any }>();
  @Output() lockEmit = new EventEmitter<any>();
  @Output() refreshEmit = new EventEmitter<{ id: any; name: any }>();
  @Output() configEmit = new EventEmitter<any>();
  @Output() stopEmit = new EventEmitter<any>();
  @Output() downloadEmit = new EventEmitter<any>();
  @Output() detalhesEmit = new EventEmitter<any>();
  @Output() calendarEmit = new EventEmitter<any>();
  @Output() search = new EventEmitter<any>();
  @Output() sortEmit = new EventEmitter<Sort>();
  @Output() historyEmit = new EventEmitter<any>();

  // ─── ViewChild ────────────────────────────────────────────────────────────

  @ViewChild('tabela') tabela!: Table;

  // ─── Injeção de dependência via inject() ─────────────────────────────────

  private readonly tabelaService = inject(TabelaService);
  public readonly identityService = inject(IdentityService);

  /**
   * DestroyRef é preferível a implementar OnDestroy manualmente:
   * takeUntilDestroyed() cancela as subscriptions automaticamente
   * quando o componente for destruído, sem necessidade de
   * armazenar Subscription ou chamar unsubscribe() no ngOnDestroy.
   */
  private readonly destroyRef = inject(DestroyRef);

  // ─── Estado interno ───────────────────────────────────────────────────────

  protected active = false;
  protected pesquisa = '';
  protected sort?: Sort;

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.initSubscriptions();
    this.addIconColumn();

    if (this.totalElements != null) {
      this.page.totalElements = this.totalElements;
    }
  }

  // ─── Métodos privados ─────────────────────────────────────────────────────

  /**
   * Inicializa as subscriptions usando takeUntilDestroyed com DestroyRef,
   * eliminando a necessidade de OnDestroy e unsubscribe() manuais.
   */
  private initSubscriptions(): void {
    this.tabelaService.active$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.onActiveChange(value));

    this.tabelaService.search$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.onSearchChange(value));
  }

  private onActiveChange(value: boolean): void {
    if (!this.tabela) return;

    if (value) {
      this.tabela.filters['enabled'] = { value, matchMode: 'equals' };
    } else {
      delete this.tabela.filters['enabled'];
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

  /** Garante que a coluna de ícones existe apenas uma vez. */
  private addIconColumn(): void {
    const jaExiste = this.cols.some(col => col.header === 'icon');
    if (!jaExiste) {
      this.cols.push({ header: 'icon', field: 'icon' });
    }
  }

  private buildPageEmit(): TabelaPageEmit {
    const size = this.page?.size ?? 10;
    const number = this.page?.number ?? 0;
    const active = this.sort?.active ?? '';
    const dir = this.sort?.direction ?? '';

    return {
      spring: {
        size,
        page: number,
        sort: active && dir ? `${active},${dir}` : ''
      },
      camunda: {
        maxResults: size,
        firstResult: this.getFirst(),
        sortBy: active,
        sortOrder: dir
      }
    };
  }

  // ─── Handlers públicos ────────────────────────────────────────────────────

  colunas(): string[] {
    return this.cols.map(col => col.field);
  }

  sortData(event: Sort): void {
    this.sort = event;
    this.emitePage();
  }

  onPageChange(event: PageEvent): void {
    this.page.size = event.pageSize;
    this.page.number = event.pageIndex;
    this.emitePage();
  }

  emitePage(): void {
    this.pageEmit.emit(this.buildPageEmit());
  }

  getFirst(): number {
    if (!this.page || this.page.number === 0) return 0;
    return this.page.number * this.page.size;
  }

  // ─── Emitters de ação ─────────────────────────────────────────────────────

  editar(id: any): void { this.editarEmit.emit(id); }
  excluir(id: any): void { this.excluirEmit.emit(id); }
  visualizar(value: any): void { this.visualizarEmit.emit(value); }
  lock(value: any): void { this.lockEmit.emit(value); }
  config(value: any): void { this.configEmit.emit(value); }
  stop(value: any): void { this.stopEmit.emit(value); }
  download(value: any): void { this.downloadEmit.emit(value); }
  detalhes(value: any): void { this.detalhesEmit.emit(value); }
  pesquisar(value: any): void { this.search.emit(value); }
  history(value: any): void { this.historyEmit.emit(value); }
  calendar(value: any): void { this.calendarEmit.emit(value); }

  refresh(id: any, name: any): void {
    this.refreshEmit.emit({ id, name });
  }

  logout(id: any, firstName: any): void {
    this.logoutEmit.emit({ id, firstName });
  }
}
