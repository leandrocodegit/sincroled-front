import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUsuariosSistemaComponent } from './lista-usuarios-sistema.component';

describe('ListaUsuariosSistemaComponent', () => {
  let component: ListaUsuariosSistemaComponent;
  let fixture: ComponentFixture<ListaUsuariosSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaUsuariosSistemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaUsuariosSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
