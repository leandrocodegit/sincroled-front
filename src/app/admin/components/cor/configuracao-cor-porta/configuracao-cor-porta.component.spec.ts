import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoCorPortaComponent } from './configuracao-cor-porta.component';

describe('ConfiguracaoCorPortaComponent', () => {
  let component: ConfiguracaoCorPortaComponent;
  let fixture: ComponentFixture<ConfiguracaoCorPortaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracaoCorPortaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracaoCorPortaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
