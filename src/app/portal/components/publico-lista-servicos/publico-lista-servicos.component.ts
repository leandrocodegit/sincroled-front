import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginaServico } from '@/shared/models/pagina-servico.model';
import { GridServicosComponent } from '@/shared/formularios-uteis/grid-servicos/grid-servicos.component';
import { PaginaService } from '@/shared/services/pagina.service';
@Component({
  selector: 'app-publico-lista-servicos',
  imports: [
    GridServicosComponent
  ],
  templateUrl: './publico-lista-servicos.component.html',
  styleUrl: './publico-lista-servicos.component.scss'
})
export class PublicoListaServicosPortalComponent implements OnInit {

  protected paginaServico?: PaginaServico;

  constructor(
    private readonly paginaService: PaginaService,
    private readonly activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(param => {
      if (param['id'])
        this.paginaService.buscarPaginaServico(param['id']).subscribe(response => {
          this.paginaServico = response;
        });
    });
  }

  iniciarServico(servico: any) {
    if (this.paginaServico)
      this.router.navigate([`/portal/servico/detalhes/${servico.id}`], { queryParams: { 'redirect': this.paginaServico.redirect } });
    // this.router.navigate([`/embedded/formulario/${servico.id}/${servico.formKey}`, {'redirect': this.paginaServico.redirect}]);
  }
}
