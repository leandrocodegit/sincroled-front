import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

declare function initCapturador(): void;

@Component({
  selector: 'app-gravador-tela',
  imports: [
    CommonModule
  ],
  templateUrl: './gravador-tela.component.html',
  styleUrl: './gravador-tela.component.scss'
})
export class GravadorTelaComponent implements OnInit, OnDestroy {

  @Input() styleClass = '!text-sm transition text-gray-400 m-1';
  @Output() stopEmit = new EventEmitter();
  protected gravando = false;
  private inicializado = false;

  ngOnInit() {
    window.addEventListener('startCaptura', this.handleCaptura.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('startCaptura', this.handleCaptura.bind(this));
  }

  handleCaptura(event: any) {
    const start = event.detail;

    this.gravando = start;

    if (!this.gravando)
      this.stopEmit.emit();
  }

  public iniciarCaptura() {
    if (!this.inicializado)
      var intervalo = setInterval(() => {
        initCapturador();
        this.inicializado = true;
        clearInterval(intervalo);
      }, 700);

  }
}
