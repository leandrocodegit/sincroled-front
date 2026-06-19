import { Menu } from "../../../shared/models/modulo.model";

export var MENU: Menu[] = [
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
  {
    order: 0,
    label: '',
    items: [{ label: 'Clientes', icon: 'pi pi-id-card', separator: false, routerLink: ['/painel/cliente'] }]
  },
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
  {
    order: 8,
    label: '',
    items: [{ label: 'Integração', icon: 'pi pi-sitemap', separator: false, routerLink: ['/painel/integracao'] }]
  }
];
