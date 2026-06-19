import { HistoryService } from '@/shared/services/history.service';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-status-integracao-assinatura',
  imports: [
    TagModule,
    ButtonModule,
    ClipboardModule
  ],
  templateUrl: './status-integracao-assinatura.component.html',
  styleUrl: './status-integracao-assinatura.component.scss'
})
export class StatusIntegracaoAssinaturaComponent implements OnInit, OnDestroy {

  @Input({ required: true }) processInstanceId?: string;

  protected data: any = {
    docUUID: "Aguardando...",
    statusDocumento: "Aguardando...",
    modeloDocumento: "Aguardando...",
    safe: "Aguardando...",
    safeName: "Aguardando...",
    statusSignatarios: "Aguardando...",
    signatariosEnviados: false,
    posicoesEnviados: false,
    posicoes: 0,
    statusGeral: "Aguardando...",
    integracaoConcluida: false
  };

  protected intervalo?: any;
  constructor(
    private readonly historyService: HistoryService,
    private readonly router: Router) { }


  ngOnInit(): void {
    this.consultarVariavale();
    this.intervalo = setInterval(() => {
      this.consultarVariavale();
    }, 5000)
  }

  ngOnDestroy(): void {
    if (this.intervalo)
      clearInterval(this.intervalo);
  }

  consultarVariavale() {

    this.historyService.listarVariaveis(
      {
        processInstanceId: this.processInstanceId,
        deserializeValues: false,
        variableName: 'statusIntegracaoAssinatura',
        noLoad: true
      }
    ).subscribe(response => {

      if (response[0]?.value)
        this.data = JSON.parse(response[0].value);

      if (this.data?.integracaoConcluida)
        clearInterval(this.intervalo);
    })

  }

  redirect() {
    this.router.navigate([`/painel/assinar`],
      { queryParams: { safe: this.data.safe, documentoId: this.data?.docUUID ?? this.data?.documentosEnviados?.[0]?.uuidDoc } })
  }

  getSeverity(status: string): any {
    switch (status) {
      case 'Montando documento': return 'warn';
      case 'Documento criado com sucesso': return 'success';
      case 'Erro': return 'danger';
      default: return 'warning';
    }
  }

  refresh() {
    // Lógica para chamar o n8n novamente
    console.log('Buscando novos status...');
  }
}
