import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoSensorComponent } from './configuracao-sensor.component';

describe('ConfiguracaoSensorComponent', () => {
  let component: ConfiguracaoSensorComponent;
  let fixture: ComponentFixture<ConfiguracaoSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracaoSensorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracaoSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
