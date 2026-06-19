import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';

import { TabelaComponent } from 'src/app/shared/components/tabela/tabela.component';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { PermissoesService } from '@/shared/services/permissoes.service';
import { RelatorioService } from '@/shared/services/relatorio.service';
import { DataAnterirorPipe } from '@/shared/pipes/data-atual.pipe';
import { ListaPermissoesComponent } from '../lista-permissoes/lista-permissoes.component';
import { baixar } from '@/shared/services/util/FileUtil';
import { TituloPesquisaComponent } from '@/shared/components/titulo-pesquisa/titulo-pesquisa.component';
import { Usuario } from '../models/usuario.model';
import { FormUsuarioComponent } from '../form-usuario/form-usuario.component';
import { HistoricoComponent } from '../historico/historico.component';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    RouterModule,
    TabelaComponent,
    PaginatorModule,
    DialogModule,
    MessageModule,
    TabsModule,
    DataAnterirorPipe,
    ListaPermissoesComponent,
    TituloPesquisaComponent,
    FormUsuarioComponent,
    HistoricoComponent
  ],
  templateUrl: './lista-usuarios.component.html'
})
export class ListaUsuariosComponent implements OnInit {


  protected tab = 'users';
  protected readonly cols: any[] = [
    { header: 'Nome', field: 'firstName' },
    { header: 'Sobrenome', field: 'lastName' },
    { header: 'Login', field: 'username' },
    { header: 'Email', field: 'email' },
    { header: 'Verificado', field: 'emailVerified' },
    { header: 'Ativo', field: 'enabled' },
    { header: 'Id', field: 'id' },
  ];

  protected readonly options = [
    { label: 10, value: 10 },
    { label: 50, value: 50 },
    { label: 100, value: 100 }
  ];

  protected itens: any[] = [];
  protected clientes: any[] = [];
  protected permissoes: any[] = [];
  protected sessoesUsuario: any[] = [];
  protected userSelecionador?: any;
  protected textoPesquisa = '';
  protected showLogout = false;
  protected view = false;
  protected viewHistorico = false;
  protected usuarioSelect?: Usuario;

  protected pagina = { page: 0, first: 0, rows: 20, pageCount: 20 };

  private readonly destroyRef = inject(DestroyRef);
  protected authUser?: string;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly usuarioService: UsuarioService,
    private readonly permissoesService: PermissoesService,
    private readonly relatorioService: RelatorioService,
    private readonly activeRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(param => { this.tab = param['tab'] ?? 'contas'; });

    this.listarUsuarios(this.pagina);
    this.listarPermissoes();
    this.listarClientes(this.pagina);
  }

  pesquisar(event: any): void {
    this.textoPesquisa = event;
  }

  onPageChange(event: PaginatorState): void {
    this.listarUsuarios(event);
  }

  selectTab(event: any): void {
    this.location.go(`/painel/users?tab=${event}`);
    this.tab = event;
  }

  protected listarUsuarios(page: PaginatorState): void {
    this.usuarioService.listaUsuarios(page)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => { this.itens = response; },
        error: err => console.error('Erro ao listar usuários:', err)
      });
  }

  protected listarClientes(page: PaginatorState): void {
    this.usuarioService.listaUsuariosCliente(page)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => { this.clientes = response; },
        error: err => console.error('Erro ao listar clientes:', err)
      });
  }

  protected listarPermissoes(): void {
    this.permissoesService.listaPermissoes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => { this.permissoes = response; },
        error: err => console.error('Erro ao listar permissões:', err)
      });
  }

  atualizaLista(): void {
    this.pagina.page = 0;
    this.pagina.first = 0;
    this.listarUsuarios(this.pagina);
  }

  getTotal(): number {
    if (!this.itens?.length) return this.pagina.rows;
    return this.pagina.rows + 1;
  }

  logout(user: any): void {
    this.usuarioService.listaSessoesUsuarios(user?.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.sessoesUsuario = response;
          this.userSelecionador = user;
          this.showLogout = true;
        },
        error: err => console.error('Erro ao listar sessões:', err)
      });
  }

  deslogar(): void {
    if (!this.userSelecionador?.id) return;
    this.usuarioService.logoutUsuario(this.userSelecionador)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.showLogout = false; },
        error: err => console.error('Erro ao deslogar usuário:', err)
      });
  }

  lock(user: any): void {
    this.usuarioService.ativarUsuario(user.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário foi alterado', life: 3000 });
          this.listarUsuarios(this.pagina);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Falha', detail: 'Falhou ao salvar', life: 3000 });
        }
      });
  }

  editarUsuario(value: any): void {
    this.usuarioSelect = value;
    this.view = true;
  }

  detalhesUsuario(value: any): void {
    this.authUser = value;
    this.viewHistorico = true;
  }

  editarPemisao(value: any): void {
    this.router.navigate([`painel/users/grupos/edit/${value.id}`]);
  }

  removerUsuario(event: any): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente remover esse usuário?',
      header: 'Confirmar ação',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Sim, remover' },
      accept: () => {
        this.usuarioService.removerUsuario(event)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.messageService.add({ severity: 'info', summary: 'Confirmação', detail: 'Usuário foi removido' });
              this.listarUsuarios(this.pagina);
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao remover usuário!' });
            }
          });
      }
    });
  }

  imprimir(formato: any): void {
    this.relatorioService.imprimirRelatorioUsuarios({
      formato
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => baixar(data),
        error: err => console.error('Erro ao imprimir relatório:', err)
      });
  }
}
