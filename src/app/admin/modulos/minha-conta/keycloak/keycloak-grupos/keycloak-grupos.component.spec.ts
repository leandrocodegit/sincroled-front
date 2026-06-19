import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeycloakGruposComponent } from './keycloak-grupos.component';

describe('KeycloakGruposComponent', () => {
  let component: KeycloakGruposComponent;
  let fixture: ComponentFixture<KeycloakGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeycloakGruposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeycloakGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
