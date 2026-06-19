import { CorService } from '@/shared/sincroled/services/cor.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfiguracaoCorPortaComponent } from '../configuracao-cor-porta/configuracao-cor-porta.component';
import { Cor } from '@/shared/sincroled/models/cor.model';
import { FormularioCorComponent } from '../formulario-cor/formulario-cor.component';
import { LabelCorComponent } from '@/shared/components/label-cor/label-cor.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-lista-cores',
  imports: [
    CommonModule,
    FormsModule,
    ToggleButtonModule,
    TableModule,
    ConfiguracaoCorPortaComponent,
    FormularioCorComponent,
    LabelCorComponent,
    SelectButtonModule
  ],
  templateUrl: './lista-cores.component.html',
  styleUrl: './lista-cores.component.scss'
})
export class ListaCoresComponent implements OnInit {

  @Input() deviceId?: string;
  protected cores: Cor[] = [];
  protected loading: boolean = false;
  protected filtroValue: any;

  protected FILTROS_INCIDENTES = [
    {
    label: 'Todos',
    key: 'TODOS'
  },
  {
    label: 'Dipositivo',
    key: 'EXCLUSIVA'
  },
  {
    label: 'Preset',
    key: 'PRESET'
  },
  {
    label: 'Evento',
    key: 'EVENTO'
  }
]

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly corService: CorService
  ) { }

  ngOnInit(): void {
    this.listaCores();
  }

  filtrar(){
      this.listaCores();
  }

  listaCores() {
    this.loading = true;
    this.corService.listaCores(this.filtroValue).subscribe({
      next: response => {
        this.cores = response.content;
      },
      error: () => this.loading = false,
      complete: () => this.loading = false
    })
  }

  getBgColorClass(colorName: string): string {
    switch (colorName.toLowerCase()) {
      case 'red': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
      case 'green': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'blue': return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]';
      default: return 'bg-slate-500';
    }
  }

  deletarConfiguracao(id: string) {
    this.confirmationService.confirm({
      message: 'Remover esse cor?',
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
        this.corService.removerCor(id).subscribe({
          next: () => {
          },
          complete: () => { this.listaCores() }
        });
      }
    });
  }

  editarConfiguracao(config: any) {
    // Redirecionamento ou abertura de Modal
    console.log('Editando config:', config.nome);
  }
}
