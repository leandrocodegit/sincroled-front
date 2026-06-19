import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelWIFIComponent } from './nivel-wifi.component';

describe('NivelWIFIComponent', () => {
  let component: NivelWIFIComponent;
  let fixture: ComponentFixture<NivelWIFIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NivelWIFIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NivelWIFIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
