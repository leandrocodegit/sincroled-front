import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaEdicaoVariavelComponent } from './tabela-edicao-variavel.component';

describe('TabelaEdicaoVariavelComponent', () => {
  let component: TabelaEdicaoVariavelComponent;
  let fixture: ComponentFixture<TabelaEdicaoVariavelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaEdicaoVariavelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaEdicaoVariavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
