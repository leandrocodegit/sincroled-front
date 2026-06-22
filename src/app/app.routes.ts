import { Routes } from '@angular/router';

import { LoginSocialComponent } from './core/auth/login-social/login-social.component';
import { AutenticacaoComponent } from './core/auth/autenticacao/autenticacao.component';

import { PainelRouteBaseComponent } from './shared/components/painel-route-base/painel-route-base.component';
import { AuthGuard } from './core/auth/services/auth.guard';
import { AppLayout } from './admin/base/sidebar/app.layout';

import { ListaUsuariosComponent } from './admin/modulos/usuarios/lista-usuarios/lista-usuarios.component';
import { FormUsuarioComponent } from './admin/modulos/usuarios/form-usuario/form-usuario.component';
import { ListaPermissoesComponent } from './admin/modulos/usuarios/lista-permissoes/lista-permissoes.component';
import { PermissoesUsuarioComponent } from './admin/modulos/usuarios/permissoes-usuario/permissoes-usuario.component';
import { HistoricoComponent } from './admin/modulos/usuarios/historico/historico.component';
import { KeycloakSessionsComponent } from './core/minha-conta/keycloak/keycloak-sessions/keycloak-sessions.component';
import { KeycloakUserProfileComponent } from './core/minha-conta/keycloak/keycloak-user-profile/keycloak-user-profile.component';
import { PainelUsuarioLogadoComponent } from './admin/modulos/minha-conta/painel-usuario-logado/painel-usuario-logado.component';
import { LogoutComponent } from './core/auth/logout/logout.component';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { ListaDispositivosComponent } from './admin/components/dispositivo/lista-dispositivos/lista-dispositivos.component';
import { ListaCoresComponent } from './admin/components/cor/lista-cores/lista-cores.component';
import { PainelMapaComponent } from './admin/components/mapa/painel-mapa/painel-mapa.component';
import { ListaAgendasComponent } from './admin/components/agenda/lista-agendas/lista-agendas.component';
import { ListaClientesComponent } from './admin/components/cliente/lista-clientes/lista-clientes.component';
import { SincronizarComponent } from './admin/components/dispositivo/sincronizar/sincronizar.component';
import { ListaIntegracaoComponent } from './admin/components/integracao/lista-integracao/lista-integracao.component';


const painelRoutes: Routes = [
  {
    path: 'painel', component: AppLayout, canActivate: [AuthGuard], children: [

      { path: 'dispositivo', component: ListaDispositivosComponent },
      { path: 'dispositivo/sincronizar', component: SincronizarComponent },
      { path: 'cores', component: ListaCoresComponent },
      { path: 'mapa', component: PainelMapaComponent },
      { path: 'agenda', component: ListaAgendasComponent },
      { path: 'cliente', component: ListaClientesComponent },
      { path: 'integracao', component: ListaIntegracaoComponent },
      {
        path: 'users', component: PainelRouteBaseComponent, children: [
          { path: '', component: ListaUsuariosComponent },
          { path: 'form', component: FormUsuarioComponent },
          { path: 'edit/:id', component: FormUsuarioComponent },
          { path: 'restricoes', component: ListaPermissoesComponent },
          { path: 'restricoes/form', component: PermissoesUsuarioComponent },
          { path: 'detalhes/:id', component: HistoricoComponent },
        ]
      },
      {
        path: 'users', component: PainelRouteBaseComponent, children: [
          { path: '', component: ListaUsuariosComponent },
          { path: 'form', component: FormUsuarioComponent },
          { path: 'edit/:id', component: FormUsuarioComponent },
          { path: 'restricoes', component: ListaPermissoesComponent },
          { path: 'restricoes/form', component: PermissoesUsuarioComponent },
          { path: 'detalhes/:id', component: HistoricoComponent },
        ]
      },
      {
        path: 'conta', component: PainelRouteBaseComponent, children: [
          { path: '', component: PainelUsuarioLogadoComponent },
          { path: 'sessions', component: KeycloakSessionsComponent },
          { path: 'perfil', component: KeycloakUserProfileComponent },
        ]
      },
      { path: '**', component: DashboardComponent }
    ],

  },
  { path: 'login', component: LoginSocialComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'auth', component: AutenticacaoComponent },
  { path: '**', redirectTo: 'painel' }
];

export const routes: Routes = painelRoutes;


