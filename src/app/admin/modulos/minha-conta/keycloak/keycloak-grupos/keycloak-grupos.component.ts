import { KeycloakService } from '@/shared/services/keycloak.service';
import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-keycloak-grupos',
  imports: [
    NgFor
  ],
  templateUrl: './keycloak-grupos.component.html',
  styleUrl: './keycloak-grupos.component.scss'
})
export class KeycloakGruposComponent {


  protected grupos: any[] = [];
  constructor(
    private readonly keycloakService: KeycloakService
  ) { }


  ngOnInit(): void {
    this.carregarGrupos();
  }

  private carregarGrupos() {
    this.keycloakService.listaGrupos().subscribe(response => {
        this.grupos = response;
    });
  }
}
