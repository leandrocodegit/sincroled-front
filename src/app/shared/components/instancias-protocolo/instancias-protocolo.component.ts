import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonComponent } from '@/shared/components/skeleton/skeleton.component';
import { HistoryService } from '@/shared/services/history.service';
import { StatusTarefaDescriptions } from '@/admin/modulos/tarefas/models/status-tarefa.enum';

@Component({
  selector: 'app-instancias-protocolo',
  imports: [
    ButtonModule,
    DataViewModule,
    CommonModule,
    RouterModule,
    SkeletonComponent
  ],
  templateUrl: './instancias-protocolo.component.html',
  styleUrl: './instancias-protocolo.component.scss'
})
export class InstanciasProtocoloComponent implements OnInit {

  @Input() tarefa: any;
  @Input() instancias: any[] = [];
  @Output() instanciaEmit = new EventEmitter();
  protected isLoad = false;
  protected readonly statusTarefaDescriptions = StatusTarefaDescriptions;  
  protected readonly cols: any[] = [
    { header: 'Id',                field: 'id' },
    { header: 'Nome do processo',  field: 'processDefinitionName' }
  ];

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly historyService: HistoryService,
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activeRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(param => {
        if (param['protocolo'])
          this.listarProtocolos(param['protocolo']);
      });
  }

  listarProtocolos(protocolo: any): void {
    this.isLoad = true;
    this.historyService.listarInstanciasPorProtocolo(protocolo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.instancias = response;
          if (this.instancias.length === 1)
            this.router.navigate([`painel/protocolo/${this.instancias[0].businessKey}/detalhes/${this.instancias[0].id}`]);
          this.isLoad = false;
        },
        error: () => { this.isLoad = false; }
      });
  }
 
}
