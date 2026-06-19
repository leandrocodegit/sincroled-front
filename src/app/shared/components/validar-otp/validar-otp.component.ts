import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-validar-otp',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputOtpModule
  ],
  templateUrl: './validar-otp.component.html',
  styleUrl: './validar-otp.component.scss'
})
export class ValidarOtpComponent implements OnInit {

  @Output() otpEmit = new EventEmitter();
  @Output() closeEmit = new EventEmitter();
  protected otpForm: FormGroup;
  protected loading = false;

  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Caso precise validar o token do Keycloak aqui antes de exibir o form
  }

  confirmar() {
    if (this.otpForm.valid) {
      this.loading = true;
      this.otpEmit.emit( this.otpForm.get('code')?.value);
    }
  }

  cancelar() {
    this.closeEmit.emit();
  }
}
