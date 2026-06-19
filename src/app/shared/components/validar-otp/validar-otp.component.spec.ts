import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarOtpComponent } from './validar-otp.component';

describe('ValidarOtpComponent', () => {
  let component: ValidarOtpComponent;
  let fixture: ComponentFixture<ValidarOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidarOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidarOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
