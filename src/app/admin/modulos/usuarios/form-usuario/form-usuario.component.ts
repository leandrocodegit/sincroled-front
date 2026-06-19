import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { FormularioModule } from 'src/app/shared/modules/formulario.module';
import { SkeletonComponent } from 'src/app/shared/components/skeleton/skeleton.component';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { GrupoService } from 'src/app/shared/services/grupo.service';
import { PermissoesService } from '@/shared/services/permissoes.service';
import { LoadService } from '@/shared/components/preload/load.service';
import { LayoutService } from '@/shared/services/layout.service';
import { Usuario } from '../models/usuario.model';
import { PermissaoEnumDescriptions } from '@/shared/models/grupo-permissao.enum';
import { TipoGrupo } from '@/shared/models/tipo-grupo.enum';
import { VoltarSalvarComponent } from '@/shared/components/voltar-salvar/voltar-salvar.component';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormularioModule,
    VoltarSalvarComponent,
    FieldsetModule,
    SkeletonComponent,
    ButtonModule
  ],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.scss'
})
export class FormUsuarioComponent implements OnInit {

  @Input() usuario!: Usuario;
  @Output() onClose = new EventEmitter()
  protected semRestricao = false;
  protected form: FormGroup;
  protected gruposAcesso: any;
  protected departamentos: any[] = [];
  protected permissoes: any[] = [];
  protected readonly grupoPermissaoDescriptions = PermissaoEnumDescriptions;
  protected perfil: any;
  protected load = false;
  protected permissaoUsuario?: any;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly usuarioService: UsuarioService,
    private readonly permissoesService: PermissoesService,
    private readonly formBuilder: FormBuilder,
    private readonly layoutService: LayoutService,
    private readonly activeRoute: ActivatedRoute,
    private readonly grupoService: GrupoService,
    private readonly loadService: LoadService,
    private readonly location: Location
  ) {
    this.form = formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cpf: ['', Validators.required],
      dataNascimento: [''],
      horario: [''],
    });
  }

  ngOnInit(): void {
    if(this.usuario?.id)
      this.buscarInfoUsuario(this.usuario?.id);
    if (!this.usuario)
      this.usuario = new Usuario()
  }

  private buscarInfoUsuario(id: string): void {
    this.load = true;
    this.usuarioService.infoUsuario(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.usuario = response;

          if (!this.usuario?.attributes?.cpf)
            this.usuario.attributes['cpf'] = [''];
          if (!this.usuario?.attributes?.phone)
            this.usuario.attributes['phone'] = [''];

          this.permissaoUsuario = { id: this.usuario.permissao };
          this.load = false;

          this.listarPerfils();
          this.listarGrupos();
          this.loadService.addRecent({
            id: this.usuario.id,
            name: this.usuario.firstName,
            descricao: 'Usuário',
            color: 'text-red-400'
          });
        },
        error: () => {
          this.load = false;
          this.usuario = new Usuario();
        }
      });
  }

  listarGrupos(): void {
    this.usuarioService.listaGruposAcesso()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => { this.gruposAcesso = response; },
        error: err => console.error('Erro ao listar grupos de acesso:', err)
      });
  }

  protected listarPerfils(): void {
    this.permissoesService.listaPermissoes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => { this.permissoes = response; },
        error: err => console.error('Erro ao listar perfis:', err)
      });
  }

  atualizarPermissao(): void {
    if (this.usuario.id)
      this.permissoesService.atualizarPermissao(this.permissaoUsuario.id, this.usuario.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.buscarInfoUsuario(this.usuario.id),
          error: err => console.error('Erro ao atualizar permissão:', err)
        });
  }

  isInvalid(field: string): boolean {
    return !!this.form.get(field)?.touched && !this.form.get(field)?.valid;
  }

  removerOtp(): void {
    this.confirmationService.confirm({
      message: 'Ao remover, o usuário deve reconfigurar seu código 2FA',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Sim, concluir' },
      accept: () => {
        this.usuarioService.removerOtp(this.usuario.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({ error: err => console.error('Erro ao remover OTP:', err) });
      }
    });
  }

  salvar(): void {
    if (!this.usuario.id) {
      this.usuario.tema = {
        dark: this.layoutService.layoutConfig().darkTheme,
        color: this.layoutService.layoutConfig().primary,
        toggle: this.layoutService.layoutState().staticMenuDesktopInactive
      };
      this.usuarioService.criarUsuario(this.usuario)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.location.back(),
          error: err => console.error('Erro ao criar usuário:', err)
        });
    } else {
      this.usuarioService.atualizarUsuario(this.usuario)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({ error: err => console.error('Erro ao atualizar usuário:', err) });
    }
  }

  joinGrupo(event: any): void {
    if (!this.usuario.id) return;

    if (event?.originalEvent?.option?.id && !event?.originalEvent?.selected) {
      this.usuarioService.joinGruposAcesso(this.usuario.id, event.originalEvent.option.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({ error: err => console.error('Erro ao adicionar grupo de acesso:', err) });
    } else {
      this.usuarioService.deleteGruposAcesso(this.usuario.id, event?.itemValue?.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({ error: err => console.error('Erro ao remover grupo de acesso:', err) });
    }
  }
}
