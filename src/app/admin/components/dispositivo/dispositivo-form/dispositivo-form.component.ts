import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Imports do PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { EnderecoComponent } from '../../cliente/endereco/endereco.component';
import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';
import { DispositivoService } from '@/shared/sincroled/services/dispositivo.service';

@Component({
  selector: 'app-dispositivo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    EnderecoComponent
  ],
  templateUrl: './dispositivo-form.component.html'
})
export class DispositivoFormComponent {
  @Input({ required: true }) device: any;
  @Input() clientes: any[] = [];

  @Output() onSalvar = new EventEmitter<Dispositivo>();
  @Output() onFechar = new EventEmitter<void>();
  @Output() onSelecionarCoordenadas = new EventEmitter<void>();

  protected view = false;

  constructor(private dispositivoService: DispositivoService) { }

  fechar() { this.onFechar.emit(); this.view = false }
  selecionarCordenadas() { this.onSelecionarCoordenadas.emit(); }

  salvar() {
    this.dispositivoService.alterarNomeDicpositivo(this.device).subscribe(() => {
      this.view = false
    });
  }

  ativar(device: Dispositivo) {
    this.dispositivoService.ativar(this.device.id).subscribe(() => {
    });
  }
}
