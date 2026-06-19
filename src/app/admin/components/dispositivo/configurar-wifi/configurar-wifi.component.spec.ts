import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarWifiComponent } from './configurar-wifi.component';

describe('ConfigurarWifiComponent', () => {
  let component: ConfigurarWifiComponent;
  let fixture: ComponentFixture<ConfigurarWifiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurarWifiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurarWifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
