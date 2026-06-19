import { CommonModule, Location } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { PickListModule } from 'primeng/picklist';
import { TabelaComponent } from '@/shared/components/tabela/tabela.component';
import { VoltarSalvarComponent } from '@/shared/components/voltar-salvar/voltar-salvar.component';
import { LayoutService } from '@/shared/services/layout.service';
import { UsuarioService } from '@/shared/services/usuario.service';
import { PermissoesService } from '@/shared/services/permissoes.service';
import { TituloPesquisaComponent } from '@/shared/components/titulo-pesquisa/titulo-pesquisa.component';

@Component({
  selector: 'app-lista-permissoes',
  imports: [
    CommonModule,
    TabelaComponent,
    DialogModule,
    FormsModule,
    VoltarSalvarComponent,
    PickListModule,
    InputText,
    TituloPesquisaComponent
  ],
  templateUrl: './lista-permissoes.component.html',
  styleUrl: './lista-permissoes.component.scss',
  styles: `
    ::ng-deep {
      .p-orderlist-list-container {
        width: 100%;
      }
    }
  `
})
export class ListaPermissoesComponent implements OnInit {

  protected readonly colsPermissoes: any[] = [
    { header: 'Nome',        field: 'nome' },
    { header: 'Usuários',    field: 'countUsers' },
    { header: 'Atribuições', field: 'countGrupos' },
  ];

  protected permissoes: any[] = [];
  protected grupos: any[] = [];
  protected usuarios: any[] = [];
  protected textoPesquisa = '';
  protected viewGrupoUsuario = false;
  protected viewPermissao = false;
  protected viewConfiguracaoPermissao = false;
  protected permissao?: any = {};

  protected pagina = { page: 0, first: 0, rows: 20, pageCount: 20 };

  private readonly usuariosDB = new Map<string, any>();
  private readonly gruposDB   = new Map<string, any>();
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly usuarioService: UsuarioService,
    private readonly permissoesService: PermissoesService,
    private readonly messageService: MessageService,
    public readonly layoutService: LayoutService,
    private readonly location: Location,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.listarPermissoes();
    this.listarUsuarios();
    this.listarPerfils();
  }

  protected listarPermissoes(): void {
    this.permissoesService.listaPermissoes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:  response => { this.permissoes = response; },
        error: err      => console.error('Erro ao listar permissões:', err)
      });
  }

  protected listarPerfils(): void {
    this.permissoesService.listaPerfisGrupo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:  response => response.forEach(grupo => this.gruposDB.set(grupo.grupo, grupo)),
        error: err      => console.error('Erro ao listar perfis:', err)
      });
  }

  protected listarUsuarios(): void {
    this.usuarioService.listaUsuarios({ page: 0, first: 0, rows: 1000, pageCount: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:  response => response.forEach(user => this.usuariosDB.set(user.id, user)),
        error: err      => console.error('Erro ao listar usuários:', err)
      });
  }

  salvarNome(): void {
    this.permissoesService.criarPermissao({ id: this.permissao.id, nome: this.permissao.nome })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.permissao.id = response.id;
          this.viewPermissao = false;
          this.listarPermissoes();
        },
        error: err => console.error('Erro ao salvar permissão:', err)
      });
  }

  salvar(isUser: boolean): void {
    this.permissoesService.atualizarGrupoPermissao(isUser, {
      id:     this.permissao.id,
      users:  this.permissao?.usersSelect?.map((user: any)   => ({ userId: user.id })),
      grupos: this.permissao?.gruposSelect?.map((grupo: any) => ({ grupo: grupo.grupo }))
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.permissao.id = response.id;
          this.listarPermissoes();
        },
        error: err => console.error('Erro ao atualizar grupo de permissão:', err)
      });
  }

  removerPermisao(value: any): void {
    this.confirmationService.confirm({
      message:       'Remover permissão?',
      header:        'Confirmar ação',
      closable:      true,
      closeOnEscape: true,
      icon:          'pi pi-exclamation-triangle',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Sim, remover' },
      accept: () => {
        this.permissoesService.removerPermissao(value)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.messageService.add({ severity: 'info',  summary: 'Confirmação', detail: 'Permissão foi removida' });
              this.listarPermissoes();
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao remover permissão!' });
            }
          });
      }
    });
  }

  editarPermissao(value?: any): void {
    this.permissao = value ?? { nome: '' };
    if (!this.permissao?.nome) this.permissao = { nome: '' };
    this.viewPermissao = true;
  }

  configurarPermissao(value?: any): void {
    if (value) this.permissao = value;
    if (!this.permissao?.gruposSelect) this.permissao.gruposSelect = [];

    this.permissao?.grupos?.forEach((grupo: any) => {
      if (this.gruposDB.has(grupo.grupo))
        this.permissao.gruposSelect.push(this.gruposDB.get(grupo.grupo));
      this.gruposDB.delete(grupo.grupo);
    });

    this.grupos = Array.from(this.gruposDB.values());
    this.viewConfiguracaoPermissao = true;
  }

  grupoUsuario(value: any): void {
    this.permissao = value;
    if (!this.permissao?.usersSelect) this.permissao.usersSelect = [];

    this.permissao.users?.forEach((user: any) => {
      if (this.usuariosDB.has(user.userId))
        this.permissao.usersSelect.push(this.usuariosDB.get(user.userId));
      this.usuariosDB.delete(user.userId);
    });

    this.usuarios = Array.from(this.usuariosDB.values());
    this.viewGrupoUsuario = true;
  }
}
