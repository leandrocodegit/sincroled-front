import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAgendasComponent } from './lista-agendas.component';

describe('ListaAgendasComponent', () => {
  let component: ListaAgendasComponent;
  let fixture: ComponentFixture<ListaAgendasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAgendasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAgendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
