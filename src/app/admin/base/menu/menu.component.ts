import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { Popover, PopoverModule } from 'primeng/popover';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';

import { Menu } from '@/shared/models/modulo.model';
import { AuthService } from '@/core/auth/services/auth.service';
import { LayoutService } from '../../../shared/services/layout.service';
import { LoadService } from '@/shared/components/preload/load.service';
import { ProtocoloService } from '@/shared/services/protocolo.service';
import { InstanciaService } from '@/shared/services/process-instance.service';
import { Protocolo } from '@/shared/models/protocolo.model';
import { AppMenuitem } from '../sidebar/app.menuitem';
import { PaginaService } from '@/shared/services/pagina.service';

/** Comprimento mínimo para disparar a busca de protocolo. */
const PROTOCOLO_MIN_LENGTH = 7;

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    AppMenuitem,
    RouterModule,
    SelectModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    PopoverModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class AppMenu implements OnInit {

  // ─── ViewChild ────────────────────────────────────────────────────────────

  @ViewChild('op') op!: Popover;

  // ─── Injeções ─────────────────────────────────────────────────────────────

  public readonly loadService = inject(LoadService);
  public readonly layoutService = inject(LayoutService);
  private readonly authService = inject(AuthService);
  private readonly protocoloService = inject(ProtocoloService);
  private readonly instanciaService = inject(InstanciaService);
  private readonly paginaService = inject(PaginaService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // ─── Estado ───────────────────────────────────────────────────────────────

  protected tenants: any[] = [];
  protected tenant: any;
  protected model: Menu[] = [];
  protected filteredProtocolos: any[] = [];
  protected protocolo: string = '';
  protected protocoloResult?: Protocolo;
  protected event?: MouseEvent;

  /**
   * Subject de busca: o pipe reativo substitui a subscription manual
   * do construtor, com switchMap cancelando requisições anteriores
   * automaticamente (evita race conditions).
   */
  protected readonly nomeFind$ = new Subject<string>();

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.initProtocoloSearch();

    if (this.router.url.startsWith('/portal')) {
      this.menuPortal();
    } else {
      this.menuInterno();
    }
  }

  // ─── Métodos privados ─────────────────────────────────────────────────────

  /**
   * Centraliza a lógica reativa de busca de protocolo.
   * - debounceTime: aguarda o usuário parar de digitar.
   * - distinctUntilChanged: ignora emissões com o mesmo valor.
   * - filter: só dispara se o protocolo ainda não foi encontrado e
   *   se o tamanho mínimo foi atingido.
   * - switchMap: cancela a requisição anterior se um novo valor chegar.
   * - takeUntilDestroyed: cancela a subscription quando o componente
   *   for destruído, sem necessidade de OnDestroy manual.
   */
  private initProtocoloSearch(): void {
    this.nomeFind$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        filter(value => value.length > PROTOCOLO_MIN_LENGTH),
        filter(value => value !== this.protocoloResult?.protocolo?.numeroProtocolo),
        switchMap(value => {
          this.protocolo = value;
          return this.protocoloService.buscarProtocolo(value);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(response => {
        const numero = response?.protocolo?.numeroProtocolo;
        if (numero && numero !== this.protocoloResult?.protocolo?.numeroProtocolo) {
          this.protocoloResult = response;
          this.op?.show(this.event);
        }
      });
  }

  // ─── Handlers públicos ────────────────────────────────────────────────────

  saveEvent(event: any): void {
    this.event = event;
  }

  selectTenant(event: { value: string }): void {
    this.tenant = event.value;
    sessionStorage.setItem('X-Tenant-ID', this.tenant);
  }

  /**
   * Chamado diretamente pelo template quando o usuário clica em pesquisar.
   * A busca por digitação é tratada pelo pipe reativo em initProtocoloSearch().
   * Só faz toggle do popover se o protocolo já foi carregado anteriormente.
   */
  pesquisarProtocolo(): void {
    if (!this.protocolo || this.protocolo.length <= PROTOCOLO_MIN_LENGTH) return;

    // Se o resultado já é o mesmo, apenas abre/fecha o popover
    if (this.protocolo === this.protocoloResult?.protocolo?.numeroProtocolo) {
      this.op?.toggle(this.event);
      return;
    }

    // Dispara busca manual empurrando no Subject
    this.nomeFind$.next(this.protocolo);
  }

  gerarProtocolo(): void {

  }

  abrirProtocolo(): void {
    const numeroProtocolo = this.protocoloResult?.protocolo?.numeroProtocolo;
    if (!numeroProtocolo) return;

    this.instanciaService
      .buscarInstanciaPorProtocolo(numeroProtocolo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => {
        const instancia = response?.[0];
        if (instancia?.businessKey && instancia?.id) {
          this.op?.hide();
          this.router.navigate([
            `/painel/protocolo/${instancia.businessKey}/detalhes/${instancia.id}`
          ]);
        }
      });
  }

  // ─── Montagem de menus ────────────────────────────────────────────────────

  menuInterno(): void {

    this.model = [
      {
        order: 0,
        label: '',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', separator: false, routerLink: ['/painel'] }]
      },
      {
        order: 0,
        label: '',
        items: [{ label: 'Dispositivos', icon: 'pi pi-microchip', separator: false, routerLink: ['/painel/dispositivo'] }]
      },
      ...(this.authService.isPermiteEditarCliente() ? [{
        order: 0,
        label: '',
        items: [{ label: 'Clientes', icon: 'pi pi-id-card', separator: false, routerLink: ['/painel/cliente'] }]
      }] : []),
      {
        order: 2,
        label: '',
        items: [{ label: 'Usuários', icon: 'pi pi-users', separator: false, routerLink: ['/painel/users'] }]
      },
      {
        order: 3,
        label: '',
        items: [{ label: 'Agendas', icon: 'pi pi-calendar', separator: false, routerLink: ['/painel/agenda'] }]
      },
      {
        order: 3,
        label: '',
        items: [{ label: 'Cores', icon: 'pi pi-palette', separator: false, routerLink: ['/painel/cores'] }]
      },
      {
        order: 3,
        label: '',
        items: [{ label: 'Mapa', icon: 'pi pi-map', separator: false, routerLink: ['/painel/mapa'] }]
      },
       ...(this.authService.isPermiteIntegracao() ? [{
        order: 9,
        label: '',
        items: [{ label: 'Integração', icon: 'pi pi-sitemap', separator: false, routerLink: ['/painel/integracao'] }]
      }] : []),
    ];


    this.model = this.model.sort((a, b) => a.order - b.order);
  }

  menuPortal(): void {
    if (this.authService.isLoggedIn()) {
      this.model.push({
        order: 0,
        label: '',
        expanded: true,
        items: [{
          label: 'Meus Protocolos',
          icon: 'pi pi-fw pi-ticket',
          separator: false,
          routerLink: ['/portal/protocolos']
        }]
      });
    }

    const servicoItem: any = {
      order: 3,
      label: '',
      active: true,
      separator: false,
      items: [{ label: 'Serviços', icon: 'pi pi-fw pi-briefcase', items: [] }]
    };

    this.paginaService
      .listaPaginasPublicas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => {
        servicoItem.items[0].items = response.map(pagina => ({
          label: pagina.nome,
          icon: 'pi pi-minus',
          routerLink: [`/portal/servicos/${pagina.id}`]
        }));

        this.handlePortalRedirect(response);
      });

    this.model.push(servicoItem);
  }

  /**
   * Redireciona para a rota correta ao acessar a raiz do portal.
   * Extraído de menuPortal() para melhor legibilidade.
   */
  private handlePortalRedirect(response: any[]): void {
    if (this.router.url !== '/') return;

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/portal/protocolos']);
    } else if (response.length > 0) {
      this.router.navigate([`/portal/servicos/${response[0].id}`]);
    }
  }
}
