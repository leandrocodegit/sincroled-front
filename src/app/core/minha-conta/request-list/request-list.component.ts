import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Módulos PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { StatusTarefa, StatusTarefaDescriptions } from '@/admin/modulos/tarefas/models/status-tarefa.enum';
import { ProtocoloService } from '@/shared/services/protocolo.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { trasnformParams } from '@/shared/services/util/OpcoesFiltro';

// Substitua pelo seu serviço real

// Interface para um resumo do pedido na lista
interface RequestSummary {
  id: string; // ID da instância do processo
  businessKey: string; // Protocolo
  processName: string;
  startTime: string;
  status: 'Em Andamento' | 'Finalizado' | 'Pendente Cliente';
}

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CardModule,
    ButtonModule,
    Tag,
    ProgressSpinnerModule,
    MessageModule,
    TooltipModule,
    RouterModule,
    PaginatorModule
  ],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {

  // Estado da UI
  protected isLoading = true;
  protected error: string | null = null;
  protected statusTarefaDescriptions = StatusTarefaDescriptions;

  // Lista de pedidos do cliente
  protected requests: any[] = [];
  protected first: number = 0;
  protected rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;

    this.filtrar({
      sort: 'dataCriacao,desc',
      page: event.page,
      size: event.pageCount
    })
  }

  constructor(
    private readonly protocoloService: ProtocoloService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserRequests();
  }

  private loadUserRequests(): void {
    this.isLoading = true;
    this.error = null;

    this.filtrar({
      sort: 'dataCriacao,desc'
    })

  }

  filtrar(filtro?: any){
     this.protocoloService.listarProtocolos(trasnformParams(filtro)).subscribe(response => {
      this.requests = response.content;
      this.isLoading = false;
    })
  }

  protected viewDetails(request: any): void {
    this.router.navigate([`/portal/detalhes/${request.protocolo.numeroProtocolo}`]);
  }

  protected getStatusSeverity(status: StatusTarefa): any {
    switch (status) {
      case StatusTarefa.ACTIVE:
        return 'info';
      case StatusTarefa.COMPLETED:
        return 'success';
      case StatusTarefa.INTERNALLY_TERMINATED:
        return 'success';
      case StatusTarefa.ACTIVE:
        return 'warning';
      case StatusTarefa.SUSPENDED:
        return 'danger';
    }
  }

  iniciarServico(tarefa: any) {
    // this.router.navigate([`/tarefa/${servico.id}/${servico.formKey}`, {'redirect': 'http://localhost:5500/conta/lista'}]);
  }
}
