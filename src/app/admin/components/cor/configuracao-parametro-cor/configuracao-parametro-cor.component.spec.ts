import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoParametroCorComponent } from './configuracao-parametro-cor.component';

describe('ConfiguracaoParametroCorComponent', () => {
  let component: ConfiguracaoParametroCorComponent;
  let fixture: ComponentFixture<ConfiguracaoParametroCorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracaoParametroCorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracaoParametroCorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
