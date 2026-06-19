import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UsuarioService } from '@/shared/services/usuario.service';
import { GrupoService } from '@/shared/services/grupo.service';
import { TipoGrupo } from '@/shared/models/tipo-grupo.enum';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TipoEventoEditor } from '../../bpmn/fluxos/criar-fluxo-bpmn/tipo-evento.enum';

@Component({
  selector: 'app-seletor-grupo-usuarios',
  imports: [
    FormsModule,
    MultiSelectModule,
    ButtonModule
  ],
  templateUrl: './seletor-usuarios.component.html',
  styleUrl: './seletor-usuarios.component.scss'
})
export class SeletorUsuariosComponent implements OnInit {

  @Output() voltarEmit = new EventEmitter();
  @Output() addEmit = new EventEmitter();
  @Input() canditatosSelecionados: any;
  @Input() tipoEventoEditor?: TipoEventoEditor;
  @Input() assignee: any;
  protected usuarios: any[] = [];
  protected grupos: any[] = [];
  protected cols: any = [
    { header: 'Nome', field: 'firstName' },
    { header: 'Email', field: 'email' }
  ];
  protected colsGrupos: any = [
    { header: 'Nome', field: 'description' }
  ];

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly grupoService: GrupoService) { }

  ngOnInit(): void {
    if (this.tipoEventoEditor && this.tipoEventoEditor.includes('GROUP'))
      this.listarDepartamentos();
    else this.listarUsuarios();
  }

  listarDepartamentos() {
    this.grupoService.listaGrupos(TipoGrupo.DEPARTMENT).subscribe(response => {
      this.grupos = response;
    })
  }

  protected listarUsuarios() {
    this.usuarioService.listaTodosUsuarios().subscribe(response => {
      if(this.tipoEventoEditor === TipoEventoEditor.LIST_ASSIGNEE_TASK){
        let assign: any = response.find(user => user.id == this.assignee);
        if(assign)
          assign['select'] = true;
      }
      this.usuarios = response;
    });
  }

  salvar() {
    this.addEmit.emit(this.canditatosSelecionados);
  }

  fechar() {
    this.voltarEmit.emit();
  }
}
