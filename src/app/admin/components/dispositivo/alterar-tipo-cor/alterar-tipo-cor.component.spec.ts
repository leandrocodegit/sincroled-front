import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarTipoCorComponent } from './alterar-tipo-cor.component';

describe('AlterarTipoCorComponent', () => {
  let component: AlterarTipoCorComponent;
  let fixture: ComponentFixture<AlterarTipoCorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlterarTipoCorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlterarTipoCorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
