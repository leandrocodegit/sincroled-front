import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { GravadorTelaComponent } from '../gravador-tela.component';
import { DrawerModule } from 'primeng/drawer';
import { NgClass } from "../../../../../../node_modules/@angular/common/index";
declare function initCapturador(): void;
@Component({
  selector: 'app-play-gravador-tela',
  imports: [
    DialogModule,
    TooltipModule,
    DrawerModule,
    NgClass
],
  templateUrl: './play-gravador-tela.component.html',
  styleUrl: './play-gravador-tela.component.scss'
})
export class PlayGravadorTelaComponent {

    @Input() styleClass = '!text-sm transition text-gray-400 m-1';
    protected visible = false;

    play(){
      var intervalo = setInterval(() => {
         initCapturador()
        clearInterval(intervalo);
      }, 1000);
     
    }
}
