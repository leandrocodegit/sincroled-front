import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TabelaComponent } from 'src/app/shared/components/tabela/tabela.component';
import { TituloCurtoComponent } from 'src/app/shared/components/titulo-curto/titulo-curto.component';
import { MinhaContaService } from '../../minha-conta/services/minha-conta.service';

@Component({
  selector: 'app-historico',
  imports: [
    CommonModule,
    FormsModule,
    PaginatorModule,
    TabelaComponent,
    SelectModule,
    TituloCurtoComponent
  ],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.scss'
})
export class HistoricoComponent implements OnInit {

  @Input() authUser?: string;

  protected readonly cols: any[] = [
    { header: 'Sessão',         field: 'sessionId' },
    { header: 'Data evento',    field: 'time' },
    { header: 'Tipo do evento', field: 'type' },
    { header: 'Endereço ip',    field: 'ipAddress' }
  ];

  protected readonly options = [
    { label: 10,  value: 10 },
    { label: 50,  value: 50 },
    { label: 100, value: 100 }
  ];

  protected itens: any[] = [];
  protected pagina = { page: 0, first: 0, rows: 20, pageCount: 20 };

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly usuarioService: MinhaContaService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.listarHistorico(this.pagina);
  }

  onPageChange(event: PaginatorState): void {
    this.pagina.first = event.first;
    this.listarHistorico(event);
  }

  protected listarHistorico(page: PaginatorState): void {
    this.usuarioService.meuHistorico(page, this.authUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:  response => { this.itens = response; },
        error: err      => console.error('Erro ao listar histórico:', err)
      });
  }

  atualizaLista(): void {
    this.pagina.page  = 0;
    this.pagina.first = 0;
    this.listarHistorico(this.pagina);
  }

  getTotal(): number {
    if (!this.itens?.length) return this.pagina.rows;
    return this.pagina.rows + 1;
  }
}
