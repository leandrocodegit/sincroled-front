import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComandosIluminacaoComponent } from './comandos-iluminacao.component';

describe('ComandosIluminacaoComponent', () => {
  let component: ComandosIluminacaoComponent;
  let fixture: ComponentFixture<ComandosIluminacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComandosIluminacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComandosIluminacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
