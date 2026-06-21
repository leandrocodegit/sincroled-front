import { Cliente } from '@/shared/sincroled/models/cliente.model';
import { ClienteService } from '@/shared/sincroled/services/cliente.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-formulario-cliente',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    SliderModule,
    TagModule
  ],
  templateUrl: './formulario-cliente.component.html',
  styleUrl: './formulario-cliente.component.scss'
})
export class FormularioClienteComponent {

  @Input() cliente: Cliente = {
        nome: '',
        ativo: false,
        host: '',
        logo: '',
        email: ''
      };
  @Output() onClose = new EventEmitter();
  @Output() onSalve = new EventEmitter();
  protected load = false;
  protected tipos: { nome: string, value: string }[] = [
    { nome: 'Evento', value: 'EVENTO' },
    { nome: 'Exclusiva', value: 'EXCLUSIVA' },
    { nome: 'Preset', value: 'PRESET' },
    { nome: 'Todos', value: 'TODOS' }
  ];

  constructor(
    private readonly clienteService: ClienteService
  ) { }

  ngOnInit(): void {/*
    if (!this.cliente)
      this.cliente = {
        nome: '',
        ativo: false,
        host: '',
        logo: '',
        email: ''
      }; */
  }

  salvar() {
    if (this.cliente) {
      this.load = true;
      this.clienteService.salvarCliente(this.cliente).subscribe({
        next: () => {
          this.onSalve.emit();
        },
        error: () => this.load = false,
        complete: () => this.load = false
      })
    }
  }

}
