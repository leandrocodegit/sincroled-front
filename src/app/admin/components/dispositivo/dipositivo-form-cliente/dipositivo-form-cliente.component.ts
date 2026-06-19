import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Imports do PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';
import { DispositivoService } from '@/shared/sincroled/services/dispositivo.service';
import { ClienteService } from '@/shared/sincroled/services/cliente.service';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-dispositivo-form-cliente',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    DialogModule,
    TooltipModule
  ],
  templateUrl: './dipositivo-form-cliente.component.html',
  styleUrl: './dipositivo-form-cliente.component.scss'
})
export class DispositivoFormClienteComponent implements OnInit {

  @Input({ required: true }) device?: Dispositivo;


  @Output() onSalvar = new EventEmitter<Dispositivo>();
  @Output() onFechar = new EventEmitter<void>();
  @Output() onSelecionarCoordenadas = new EventEmitter<void>();

  protected view = false;
  protected clientes: any[] = [];

  constructor(
    private readonly dispositivoService: DispositivoService,
    private readonly clienteService: ClienteService) { }

    ngOnInit(): void {
    }

    listaClientes(){
    this.clienteService.listaClientes().subscribe(response => {
      this.clientes = response.content;
    })
  }

  fechar() { this.onFechar.emit(); this.view = false }
  selecionarCordenadas() { this.onSelecionarCoordenadas.emit(); }

  salvar() {
    if(this.device)
    this.dispositivoService.alterarClienteDicpositivo(this.device).subscribe(() => {
      this.view = false
    });
  }
}
