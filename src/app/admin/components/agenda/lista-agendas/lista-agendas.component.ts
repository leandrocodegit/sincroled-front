import { Agenda, AgendaRequest } from '@/shared/sincroled/models/agenda.model';
import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormularioAgendaComponent } from '../formulario-agenda/formulario-agenda.component';
import { Efeito } from '@/shared/sincroled/models/constantes/Efeito';
import { SelecaoDispositivoComponent } from '../../dispositivo/selecao-dispositivo/selecao-dispositivo.component';
import { AgendaService } from '@/shared/sincroled/services/agenda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '@/core/auth/services/auth.service';

@Component({
  selector: 'app-lista-agendas',
  imports: [
    CommonModule,
    ButtonModule,
    FormularioAgendaComponent,
    SelecaoDispositivoComponent
  ],
  templateUrl: './lista-agendas.component.html',
  styleUrl: './lista-agendas.component.scss'
})
export class ListaAgendasComponent implements OnInit {

  protected agendas: Agenda[] = [];
  protected viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private readonly agendaService: AgendaService,
    private readonly activedRoute: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
    private readonly location: Location,
    public readonly authService: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {

    this.activedRoute.queryParams.subscribe(param => {
      this.viewMode = param['view'] ?? 'grid'
    })

    this.listarAgendas();
  }

  toggleView(): void {
    this.location.go(
      this.router.url.split('?')[0],
      `view=${this.viewMode}`
    );
  }

  listarAgendas() {
    this.agendaService.listaTodosAgendas().subscribe(response => {
      this.agendas = response.content;
    })
  }

  alterarAgenda(agenda: Agenda, devices: Dispositivo[]) {

    let agendaFormatada = new AgendaRequest({
      ...(agenda || {}),
      dispositivos: devices.map(device => device.id)
    })

    this.agendaService.alterarAgenda(agendaFormatada, true).subscribe({
      next: () => {
      },
      error: () => { },
      complete: () => { this.listarAgendas() }
    });

  }

  ativarAgenda(agenda: Agenda) {
    agenda.ativo = !agenda.ativo;
    this.agendaService.ativarAgenda(agenda.id).subscribe({
      next: () => {
      },
      error: () => { agenda.ativo = !agenda.ativo },
      complete: () => { }
    });

  }

  excluir(id: string) {
    this.confirmationService.confirm({
      message: 'Remover esse agenda?',
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
        this.agendaService.removerAgenda(id).subscribe({
          next: () => {
          },
          complete: () => { this.listarAgendas() }
        });
      }
    });
  }

}
