import { Component, ElementRef, Input } from '@angular/core';
import { AppMenu } from '../menu/menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    AppMenu
  ],
  template: ` <div class="layout-sidebar flex flex-col justify-between !h-full !p-0">
        <app-menu></app-menu>
        <img class="p-6 mb-8 lg:mb-[25%]" src="assets/imagens/sbc.png"/>
    </div>`
})
export class AppSidebar {

  constructor(public el: ElementRef) { }
}
