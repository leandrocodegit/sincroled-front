import { Cor } from '@/shared/sincroled/models/cor.model';
import { CorService } from '@/shared/sincroled/services/cor.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-formulario-cor',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    SliderModule,
    TagModule
  ],
  templateUrl: './formulario-cor.component.html',
  styleUrl: './formulario-cor.component.scss'
})
export class FormularioCorComponent implements OnInit {

  @Input() cor?: Cor;
  @Input() novaCor = false;
  @Output() onSalve = new EventEmitter();
  protected view = false;
  protected load = false;
  protected tipos: { nome: string, value: string }[] = [
    { nome: 'Evento', value: 'EVENTO' },
    { nome: 'Exclusiva', value: 'EXCLUSIVA' },
    { nome: 'Preset', value: 'PRESET' },
    { nome: 'Todos', value: 'TODOS' }
  ];

  constructor(
    private readonly corService: CorService
  ) { }

  ngOnInit(): void {
    if (this.novaCor)
      this.cor = new Cor();
  }

  salvar() {
    if (this.cor) {
      this.load = true;
      this.corService.salvarCor(this.cor).subscribe({
        next: () => {
          this.onSalve.emit();
        },
        error: () => this.load = false,
        complete: () => this.load = false
      })
    }
  }

  fechar() {
    this.view = false;
  }

}
