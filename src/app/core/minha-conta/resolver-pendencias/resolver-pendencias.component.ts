import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { ExecuteAppsComponent } from '@/shared/formularios-uteis/execute-apps/execute-apps.component';
import { MessageModule } from 'primeng/message';
import { ProtocoloService } from '@/shared/services/protocolo.service';

@Component({
  selector: 'app-resolver-pendencias',
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ExecuteAppsComponent,
    MessageModule
  ],
  templateUrl: './resolver-pendencias.component.html',
  styleUrl: './resolver-pendencias.component.scss'
})
export class ResolverPendenciasComponent implements OnInit {

  protected isLoading = false;
  protected error?: string;
  protected tarefa?: any;
  protected processInstanceId?: string;

  constructor(
    private readonly protocoloService: ProtocoloService,
    private readonly activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.processInstanceId = params['processInstanceId'];
      if (this.processInstanceId) {
        this.loadRequestData(this.processInstanceId);
      } else {
        this.error = "Nenhum pedido foi especificado para acompanhamento.";
        this.isLoading = false;
      }
    });
  }

  private loadRequestData(protocoloId: string): void {
    this.isLoading = true;
    this.error = undefined;

    this.protocoloService.listarTarefasDelegadas(protocoloId).subscribe({
      next: (response: any) => {
        this.tarefa = response[0] ?? undefined;
        this.isLoading = false;
      },
      error: () => { this.error = 'Nenhuma informação foi encontrada!'; this.isLoading = false }
    })
  }
}
