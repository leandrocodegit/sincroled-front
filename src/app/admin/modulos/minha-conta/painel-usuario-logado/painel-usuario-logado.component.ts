import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeycloakUserProfileComponent } from '../keycloak/keycloak-user-profile/keycloak-user-profile.component';
import { KeycloakSessionsComponent } from '../keycloak/keycloak-sessions/keycloak-sessions.component';
import { KeycloakAccountSettingsComponent } from '../keycloak/keycloak-account-settings/keycloak-account-settings.component';

@Component({
  selector: 'app-painel-usuario-logado',
  imports: [
    RouterModule,
    KeycloakUserProfileComponent,
    KeycloakSessionsComponent,
    KeycloakAccountSettingsComponent
  ],
  templateUrl: './painel-usuario-logado.component.html',
  styleUrl: './painel-usuario-logado.component.scss'
})
export class PainelUsuarioLogadoComponent {

}
