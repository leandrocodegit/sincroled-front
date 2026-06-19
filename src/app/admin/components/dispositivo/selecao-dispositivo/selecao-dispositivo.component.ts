import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';
import { DispositivoService } from '@/shared/sincroled/services/dispositivo.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-selecao-dispositivo',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule
  ],
  templateUrl: './selecao-dispositivo.component.html',
  styleUrl: './selecao-dispositivo.component.scss'
})
export class SelecaoDispositivoComponent {

  @Input() selecionados: Dispositivo[] = [];
  @Input() outlined = false;
  @Output() onSalve = new EventEmitter<Dispositivo[]>();

  protected view = false;
  protected loading = false;
  protected devices: Dispositivo[] = [];
  protected devicesFiltrados: Dispositivo[] = [];
  protected busca = '';
  protected filtroAtivo: 'todos' | 'online' = 'todos';

  constructor(private dispositivoService: DispositivoService) {}

  listarDispositivos() {
    this.loading = true;
    this.dispositivoService.listaTodosDispositivos(false).subscribe({
      next: response => {
        this.devices = response.content;
        this.filtrar();
      },
      complete: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  setFiltro(f: 'todos' | 'online') {
    this.filtroAtivo = f;
    this.filtrar();
  }

  filtrar() {
    this.devicesFiltrados = this.devices.filter(d => {
      const matchBusca = !this.busca || d.nome.toLowerCase().includes(this.busca.toLowerCase());
      const matchFiltro = this.filtroAtivo === 'todos' || d.conexao?.status  == 'online';
      return matchBusca && matchFiltro;
    });
  }

  toggleDevice(device: Dispositivo) {
    if (this.isSelecionado(device)) {
      this.remover(device);
    } else {
      this.selecionados = [...this.selecionados, device];
    }
  }

  isSelecionado(device: Dispositivo): boolean {
    return this.selecionados.some(s => s.id === device.id);
  }

  remover(device: Dispositivo) {
    this.selecionados = this.selecionados.filter(s => s.id !== device.id);
  }

  confirmarAlteracao(click: MouseEvent) {
    click.stopPropagation();
    this.onSalve.emit(this.selecionados);
  }
}
