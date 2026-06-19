import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TabelaService } from '../tabela/tabela.service';
import { Location } from '@angular/common';
import { LayoutService } from '@/shared/services/layout.service';
import { TooltipModule } from 'primeng/tooltip';
import { ImprimirComponent } from '../imprimir/imprimir.component';
import { DrawerModule } from 'primeng/drawer';
import { InstanciaService } from '@/shared/services/process-instance.service';
import { FormularioModule } from "@/shared/modules/formulario.module";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-titulo-pesquisa',
  imports: [
    FormsModule,
    ButtonModule,
    ToggleButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    RouterModule,
    TooltipModule,
    ImprimirComponent, 
    DrawerModule,
    FormularioModule
  ],
  templateUrl: './titulo-pesquisa.component.html',
  styleUrl: './titulo-pesquisa.component.scss'
})
export class TituloPesquisaComponent {

  @Output() searchEmit = new EventEmitter();
  @Output() customEmit = new EventEmitter();
  @Output() adicionalEmit = new EventEmitter();
  @Output() ativosEmit = new EventEmitter();
  @Output() customAdd = new EventEmitter();
  @Output() printEmit = new EventEmitter();
  @Output() voltarEmit = new EventEmitter();
  @Input() onlyFind = false;
  @Input() ativos = false;
  @Input() notificarInstancia = false;
  @Input() value: any;
  @Input() fieldAtivos: any;
  @Input() instancias: any[] = [];
  private debounceTimer: any;
  protected visivel = {
    lote: false
  }

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly tabelaService: TabelaService,
    private readonly location: Location,
    private readonly instanciaService: InstanciaService,
    public readonly layoutService: LayoutService
  ) {
    this.instanciaService.closeLote
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.visivel.lote = false);
  }

  pesquisar(value: any) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.searchEmit.emit(value);
    }, 400);

    if (!this.onlyFind)
      this.tabelaService.find(value);
  }

  filtrarAtivos() {
    this.tabelaService.findActive({ field: this.fieldAtivos, value: this.ativos });
  }

  customEvent() {
    this.customEmit.emit();
  }

  voltar() {
    this.location.back();
  }


}
