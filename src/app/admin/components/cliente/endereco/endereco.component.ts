import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Imports do PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Endereco } from '@/shared/models/endereco.model';
import { ESTADOS } from '@/shared/models/Estados';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'app-endereco',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    SelectModule
  ],
  templateUrl: './endereco.component.html'
})
export class EnderecoComponent implements OnInit, AfterViewInit {

  @Input() device: any;
  @Input() endereco: Endereco = new Endereco();

  public form: FormGroup;
  protected selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);
  protected estados = ESTADOS;
  protected cidades: string[] = [];

  constructor(
    private http: HttpClient,
    private formBuild: FormBuilder
  ) {
    this.form = this.formBuild.group({
      'cep': [''],
      'state': ['', Validators.required],
      'city': ['', Validators.required],
      'neighborhood': ['', Validators.required],
      'street': ['', Validators.required],
      'numero': ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if(!this.endereco)
      this.endereco = new Endereco();
  }

  ngAfterViewInit(): void {
    if (this.endereco?.state) {
      const state = this.endereco.state;
      const city = this.endereco.city;
      this.carregarCidade(state, city);
    }
  }

  consultaCep(event: any) {
    const value = event.target.value;
    if (value && value.replace('-', '').length === 8) {
      this.http.get('https://brasilapi.com.br/api/cep/v2/' + value.replace('-', '')).subscribe((response: any) => {
        response.city = this.normalizeText(response.city);
        this.carregarCidade(response.state, response.city);
        this.endereco.street = response.street;
        this.endereco.state = response.state;
        this.endereco.neighborhood = response.neighborhood;
        this.endereco.city = response.city;
      });
    }
  }

  carregarCidade(state: string, city: string) {
    this.cidades.push(city);
    this.listaCidade(state);
  }

  listaCidade(estado: string) {
    this.http.get('https://brasilapi.com.br/api/ibge/municipios/v1/' + estado).subscribe((response: any) => {
      this.cidades = response.map((city: any) => this.normalizeText(city.nome));
    });
  }

  atualizouEstado() {
    // Dispara a busca de cidades quando o usuário troca o estado manualmente no dropdown
    if (this.endereco.state) {
      this.cidades = [];
      this.listaCidade(this.endereco.state);
    }
  }

  possuiErro(form: any) {
    if (!form || !form.errors || !form.touched) {
      return false;
    }
    return form.errors.required;
  }

  isValid(name: string): boolean {
    const form = this.form.controls[name];
    if (form) return form.valid;
    return false;
  }

  normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ');
  }
}
