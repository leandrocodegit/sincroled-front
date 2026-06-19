import { TabelaComponent } from '@/shared/components/tabela/tabela.component';
import { TituloPesquisaComponent } from '@/shared/components/titulo-pesquisa/titulo-pesquisa.component';
import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Integracao } from '@/shared/sincroled/models/integracao.model';
import { IntegracaoService } from '@/shared/sincroled/services/integracao.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CorService } from '@/shared/sincroled/services/cor.service';
import { Cor } from '@/shared/sincroled/models/cor.model';
import { ConfirmationService } from 'primeng/api';
import { DispositivoService } from '@/shared/sincroled/services/dispositivo.service';
import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';


@Component({
  selector: 'app-lista-integracao',
  imports: [
    CommonModule,
    FormsModule,
    TituloPesquisaComponent,
    TabelaComponent,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule
  ],
  templateUrl: './lista-integracao.component.html',
  styleUrl: './lista-integracao.component.scss'
})
export class ListaIntegracaoComponent {

  protected readonly cols: any[] = [
    { header: 'Nome', field: 'nome' },
    { header: 'Dispositivo', field: 'dispositivo', subfield: 'nome'  },
    { header: 'Ativo', field: 'ativo', isTag: true },
    { header: 'Ip de Origem', field: 'origem' },
    { header: 'Host', field: 'host', isCopy: true }
  ];

  protected readonly options = [
    { label: 10, value: 10 },
    { label: 50, value: 50 },
    { label: 100, value: 100 }
  ];

  protected itens: any[] = [];
  protected integracoes: Integracao[] = [];
  protected cores: Cor[] = [];
  protected devices: Dispositivo[] = [];
  protected edit = false;
  protected load = false;
  protected corLoad = false;
  protected nome = '';
  protected cor?: Cor;
  protected dispositivo?: Dispositivo;
  protected origem = '';

  protected pagina = { page: 0, first: 0, rows: 20, pageCount: 20 };

  constructor(
    private readonly dispositivoService: DispositivoService,
    private readonly confirmationService: ConfirmationService,
    private readonly integracaoService: IntegracaoService,
    private readonly corService: CorService) { }

  ngOnInit(): void {
    this.listarIntegarcoes()
  }

  listarDispositivos(noLoad?: boolean) {
    this.dispositivoService.listaTodosDispositivos(noLoad ?? false).subscribe(response => {
      this.devices = response.content;
    })
  }

  listaCores() {
    this.corLoad = true;
    this.corService.listaCores('EVENTO').subscribe({
      next: response => {
        this.cores = response.content;
      },
      error: () => this.corLoad = false,
      complete: () => this.corLoad = false
    })
  }

  listarIntegarcoes() {
    this.integracaoService.listaTodasIntegracoes().subscribe(response => {
      this.integracoes = response.content;
    })
  }

  criar() {
    this.integracaoService.criarIntegracao({
      dispositivo: this.dispositivo?.id,
      origem: this.origem,
      cor: this.cor?.id,
      nome: this.nome
    }).subscribe({
      next: () => {
        this.listarIntegarcoes();
        this.load = false;
      }, error: () => this.load = false
    })

  }

  excluir(id: string) {
    this.confirmationService.confirm({
      message: 'Remover integração?',
      header: 'Confirmar ação',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-trash',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'danger',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Sim, Remover',
      },
      accept: () => {
        this.integracaoService.removerIntegracao(id).subscribe({
          next: () => {
          },
          complete: () => { this.listarIntegarcoes() }
        });
      }
    });
  }
}

