import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TabelaComponent } from 'src/app/shared/components/tabela/tabela.component';
import { TituloPesquisaComponent } from 'src/app/shared/components/titulo-pesquisa/titulo-pesquisa.component';
import { GrupoService } from 'src/app/shared/services/grupo.service';
import { TipoGrupo } from '@/shared/models/tipo-grupo.enum';
import { FormularioGrupoSignatarioComponent } from '../formulario-grupo-signatario/formulario-grupo-signatario.component';

@Component({
  selector: 'app-lista-grupos-signatarios',
  imports: [
    TabelaComponent,
    TituloPesquisaComponent,
    FormularioGrupoSignatarioComponent,
    DialogModule
  ],
  templateUrl: './lista-grupos-signatarios.component.html'
})
export class ListaGruposSignatariosComponent implements OnInit {

  protected readonly colsSignatarios: any[] = [
    { header: 'Descrição', field: 'description' },
    { header: 'Id',        field: 'id' }
  ];

  protected signatarios: any[] = [];
  protected grupoSelect?: any;
  protected pagina = { page: 0, first: 0, rows: 20, pageCount: 20 };

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly grupoService: GrupoService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.listarGrupos();
  }

  protected listarGrupos(): void {
    this.grupoService.listaGrupos(TipoGrupo.SIGNER)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:  response => { this.signatarios = response; },
        error: err      => console.error('Erro ao listar grupos signatários:', err)
      });
  }

  editarGrupo(event: any): void {
    this.grupoSelect = event;
  }

  removerGrupo(value: any): void {
    this.confirmationService.confirm({
      message:       'Deseja realmente remover esse grupo?',
      header:        'Confirmar ação',
      closable:      true,
      closeOnEscape: true,
      icon:          'pi pi-exclamation-triangle',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Sim, remover' },
      accept: () => {
        this.grupoService.removerGrupo(value)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.messageService.add({ severity: 'info', summary: 'Confirmação', detail: 'Grupo foi removido' });
              this.listarGrupos();
            },
            error: err => console.error('Erro ao remover grupo:', err)
          });
      }
    });
  }
}
