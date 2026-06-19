import { UsuarioService } from '@/shared/services/usuario.service';
import { CommonModule }   from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule }        from '@angular/forms';

import { AvatarModule }     from 'primeng/avatar';
import { ButtonModule }     from 'primeng/button';
import { IconFieldModule }  from 'primeng/iconfield';
import { InputIconModule }  from 'primeng/inputicon';
import { InputTextModule }  from 'primeng/inputtext';
import { PaginatorState }   from 'primeng/paginator';
import { PopoverModule }    from 'primeng/popover';

import { Usuario } from '../models/usuario.model';

// Página padrão usada na carga inicial
const PAGE_INICIAL: PaginatorState = { page: 1, first: 1, rows: 20, pageCount: 20 };

@Component({
  selector: 'app-lista-usuarios-sistema',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    ButtonModule,
    PopoverModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './lista-usuarios-sistema.component.html',
  styleUrl:    './lista-usuarios-sistema.component.scss',
})
export class ListaUsuariosSistemaComponent implements OnInit {

  @Input() isSelect  = false;
  @Input() isLoad    = false;
  @Input() icon      = false;
  @Input() iconField = false;
  @Input() btLabel   = 'Adicionar Signatário';
  @Input() usuarioSelecionados: Map<string, Usuario> = new Map();

  @Output() selectEmit = new EventEmitter<Usuario>();
 
  private   allUsers:       Usuario[] = [];
  protected availableUsers: Usuario[] = [];
  protected searchTerm      = '';

  constructor(private readonly usuarioService: UsuarioService){}

  ngOnInit(): void {
    this.listarUsuarios(PAGE_INICIAL);
  }

  protected listarUsuarios(page: PaginatorState): void {
    this.usuarioService
      .listaUsuarios(page)
      .subscribe(response => {
        this.allUsers       = response ?? [];
        this.availableUsers = this.allUsers;
      });
  }

  protected filterUsers(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.availableUsers = term
      ? this.allUsers.filter(user =>
          `${user.firstName ?? ''} ${user.lastName ?? ''}`
            .toLowerCase()
            .includes(term)
        )
      : this.allUsers;
  }

  protected getInitials(user: Usuario): string {
    const first = user.firstName?.charAt(0) ?? '';
    const last  = user.lastName?.charAt(0)  ?? '';
    return `${first}${last}`.toUpperCase();
  }
}
