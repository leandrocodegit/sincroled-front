import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-detalhes-usuario',
  imports: [
    CommonModule,
    TooltipModule,
    AvatarModule,
    PopoverModule,
    ButtonModule,
    RouterModule
  ],
  templateUrl: './detalhes-usuario.component.html',
  styleUrl: './detalhes-usuario.component.scss'
})
export class DetalhesUsuarioComponent {

  @Input() user?: Usuario;

}
