import { TabelaComponent } from '@/shared/components/tabela/tabela.component';
import { TituloPesquisaComponent } from '@/shared/components/titulo-pesquisa/titulo-pesquisa.component';
import { Cliente } from '@/shared/sincroled/models/cliente.model';
import { ClienteService } from '@/shared/sincroled/services/cliente.service';
import { Component, OnInit } from '@angular/core';
import { FormularioClienteComponent } from '../formulario-cliente/formulario-cliente.component';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-clientes',
  imports: [
    CommonModule,
    FormsModule,
    TituloPesquisaComponent,
    TabelaComponent,
    FormularioClienteComponent,
    DialogModule
  ],
  templateUrl: './lista-clientes.component.html',
  styleUrl: './lista-clientes.component.scss'
})
export class ListaClientesComponent implements OnInit {

  protected readonly cols: any[] = [
    { header: 'Nome', field: 'nome' },
    { header: 'Ativo', field: 'ativo', isTag: true },
    { header: 'Host', field: 'host', isRedirect: true, isCopy: true },
    { header: 'Id', field: 'id' },
  ];

  protected readonly options = [
    { label: 10, value: 10 },
    { label: 50, value: 50 },
    { label: 100, value: 100 }
  ];

  protected itens: any[] = [];
  protected clientes: any[] = [];
  protected edit = false;
  protected clienteSelect?: Cliente;

  protected pagina = { page: 0, first: 0, rows: 20, pageCount: 20 };

  constructor(private readonly clienteService: ClienteService) { }

  ngOnInit(): void {
    this.listarClientes()
  }

  listarClientes() {
    this.clienteService.listaClientes().subscribe(response => {
      this.clientes = response.content;
    })
  }

  ativar(cliente: Cliente) {
    if (cliente.id)
      this.clienteService.ativarCleinte(cliente.id).subscribe({
        next: () => {
          this.listarClientes();
        },
        error: () => cliente.ativo = !cliente.ativo
      })
  }

  editarCliente(cliente?: any) {
    this.clienteSelect = structuredClone(cliente);
    this.edit = true;
  }
}

