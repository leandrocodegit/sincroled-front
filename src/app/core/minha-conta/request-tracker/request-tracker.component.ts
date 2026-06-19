import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Importado para ler parâmetros da URL

// Módulos PrimeNG para a UI
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { ServicoService } from '@/shared/services/servico.service';
import { TimelineComponent } from '@/shared/components/timeline/timeline.component';
import { StatusTarefa, StatusTarefaDescriptions } from '@/admin/modulos/tarefas/models/status-tarefa.enum';
import { InstanciasProtocoloComponent } from '@/shared/components/instancias-protocolo/instancias-protocolo.component';
import { ProtocoloService } from '@/shared/services/protocolo.service';
import { environment } from 'src/environments/environment';
import { LayoutService } from '@/shared/services/layout.service';

 interface TrackedRequest {
  id: string;
  businessKey: string;
  startTime: string;
}

interface RequestStep {
  label: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
  date?: string;
  icon: string;
  color: string;
}

interface PendingTask {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-request-tracker',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CardModule,
    TimelineModule,
    ButtonModule,
    TagModule,
    ProgressSpinnerModule,
    MessageModule,
    TooltipModule,
    TagModule,
    TimelineComponent,
    InstanciasProtocoloComponent
  ],
  templateUrl: './request-tracker.component.html',
  styleUrls: ['./request-tracker.component.scss']
})
export class RequestTrackerComponent implements OnInit {

  protected statusTarefaDescriptions = StatusTarefaDescriptions;
  protected isLoading = false;
  protected error?: string;
  protected protocolo?: any;
  protected servico: any;
  // Dados do Pedido
  protected request: TrackedRequest | null = null;
  protected requestSteps: RequestStep[] = [];
  protected pendingTasks: PendingTask[] = [];
  protected protocoloId?: string;
  protected instanciaSelecionada = false;
  protected instanceId?: any;

  constructor(
    private readonly servicoService: ServicoService,
    private readonly protocoloService: ProtocoloService,
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    public readonly layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.protocoloId = params['protocoloId'];
      if (this.protocoloId) {
        this.loadRequestData(this.protocoloId);
      } else {
        this.error = "Nenhum pedido foi especificado para acompanhamento.";
        this.isLoading = false;
      }
    });

    this.activeRoute.queryParams.subscribe(param => {
      this.instanceId = param['instancia'];
    })
  }

  private loadRequestData(protocoloId: string): void {
    this.isLoading = true;
    this.error = undefined;

    this.protocoloService.buscarProtocolo(protocoloId).subscribe(response => {
      this.protocolo = response;
      if (this.instanceId && this.protocolo?.instancias.length > 1) {
        const instancia = this.protocolo?.instancias.find((instance: any) => instance.id == this.instanceId);
        if (instancia) {
          this.protocolo.instancia = instancia;
          this.instanciaSelecionada = true;
        }
      }
      this.isLoading = false;
      this.buscarServico(this.protocolo?.detalhe.servicoId)
    }, () => { this.error = 'Nenhuma informação foi encontrada!'; this.isLoading = false })
  }

  private buscarServico(servicoId: string): void {
    this.isLoading = true;
    this.servicoService.buscarServico(servicoId).subscribe(response => {
      this.servico = response;
      this.isLoading = false;
    }, () => this.isLoading = false)
  }

  protected getStatusSeverity(status: StatusTarefa): any {
    switch (status) {
      case StatusTarefa.ACTIVE:
        return 'info';
      case StatusTarefa.COMPLETED:
        return 'success';
      case StatusTarefa.ACTIVE:
        return 'warning';
      case StatusTarefa.SUSPENDED:
        return 'danger';
    }
  }

  protected onTaskAction(): void {
    this.router.navigate([`${environment.router}/detalhes/pendencias/${this.protocolo?.tarefa?.caseInstanceId ?? this.protocolo?.tarefa?.processInstanceId}`]);
  }

  formatDate() {
    return 'dd/MM/yyyy HH:mm';
  }
}

