import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIntegracaoComponent } from './lista-integracao.component';

describe('ListaIntegracaoComponent', () => {
  let component: ListaIntegracaoComponent;
  let fixture: ComponentFixture<ListaIntegracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaIntegracaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaIntegracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
