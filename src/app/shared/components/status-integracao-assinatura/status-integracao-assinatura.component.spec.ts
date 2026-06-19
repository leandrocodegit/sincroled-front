import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusIntegracaoAssinaturaComponent } from './status-integracao-assinatura.component';

describe('StatusIntegracaoAssinaturaComponent', () => {
  let component: StatusIntegracaoAssinaturaComponent;
  let fixture: ComponentFixture<StatusIntegracaoAssinaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusIntegracaoAssinaturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusIntegracaoAssinaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
