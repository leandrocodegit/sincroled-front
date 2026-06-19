import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecaoDispositivoComponent } from './selecao-dispositivo.component';

describe('SelecaoDispositivoComponent', () => {
  let component: SelecaoDispositivoComponent;
  let fixture: ComponentFixture<SelecaoDispositivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecaoDispositivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecaoDispositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
