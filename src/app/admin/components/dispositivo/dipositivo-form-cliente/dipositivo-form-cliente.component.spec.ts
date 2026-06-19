import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipositivoFormClienteComponent } from './dipositivo-form-cliente.component';

describe('DipositivoFormClienteComponent', () => {
  let component: DipositivoFormClienteComponent;
  let fixture: ComponentFixture<DipositivoFormClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DipositivoFormClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DipositivoFormClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
