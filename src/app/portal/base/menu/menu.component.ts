import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '@/shared/services/layout.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { LoadService } from '@/shared/components/preload/load.service';
import { Popover, PopoverModule } from 'primeng/popover';
import { Protocolo } from '@/shared/models/protocolo.model';
import { Subject } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '@/core/auth/services/auth.service';
import { Menu } from '@/shared/models/modulo.model';
import { PaginaService } from '@/shared/services/pagina.service';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SelectModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    PopoverModule,
    AccordionModule,
    TagModule,
    BadgeModule,
    MenuModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class AppMenu implements AfterViewInit {

  @Input() embedded = false;
  protected tenants: any[] = [];
  protected tenant: any;
  protected model: Menu[] = [];
  protected filteredProtocolos: any[] = [];
  protected protocoloResult?: Protocolo;
  protected nomeFind = new Subject<string>();
  protected event?: any;
  protected paginasServico: any[] = [];
  @ViewChild('op') op!: Popover;


  constructor(
    public readonly loadService: LoadService,
    private readonly authService: AuthService,
    public readonly layoutService: LayoutService,
    private readonly paginaService: PaginaService,
    private readonly router: Router

  ) {
  }

  ngAfterViewInit(): void {

    if (this.authService.isLoggedIn())
      this.model.push({
        order: 0,
        label: 'Meus Protocolos',
        expanded: true,
        icon: 'pi pi-fw pi-ticket', separator: false,
        action: () => this.router.navigate(['/portal/protocolos'])
      })

       this.model.push({
        order: 0,
        label: 'Validar Documento',
        expanded: true,
        icon: 'pi pi-file-check', separator: false,
        action: () => this.router.navigate(['/portal/assinar/validar'])
      })

    this.paginaService.listarPaginas().subscribe(response => {

      this.paginasServico = response;
      this.mapearMenuComIconeDinamico(this.paginasServico)

      if (this.router.url == '/portal') {
        if (this.authService.isLoggedIn())
          this.router.navigate([`/portal/protocolos`])
        else if (response.length) {
          this.router.navigate([`/portal/servicos/${response[0].id}`], { queryParams: { embedded: this.embedded } })
        }
      }
    });
  }

  protected paginasMenu: MenuItem[] = [];

  mapearMenuComIconeDinamico(dadosDoServidor: any[]) {
    this.paginasMenu = dadosDoServidor.map(pagina => {
      const primeiroServico = pagina.servicos && pagina.servicos.length > 0
        ? pagina.servicos[0]
        : null;

      return {
        label: pagina.nome,
        icon: primeiroServico ? 'material-icons' : 'pi pi-folder',
        automationId: primeiroServico?.icon,
        action: () => this.router.navigate([`/portal/servicos/${pagina.id}`])
      };
    });
  }

  selecionarPagina(id: string) {
    console.log('Navegando para a página:', id);
    // Aqui você pode usar o Router para navegar
  }

  saveEvent(event: any) {
    this.event = event;
  }

  selectTenant(event: any) {
    this.tenant = event.value;
    sessionStorage.setItem("X-Tenant-ID", this.tenant);
  }
}
