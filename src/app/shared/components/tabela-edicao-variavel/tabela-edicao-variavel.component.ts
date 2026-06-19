import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FluidModule } from 'primeng/fluid';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

import { EditorJsonComponent } from '@/admin/modulos/bpmn/conector/editor-json/editor-json.component';
import { isStringArray, recuperarColunasTabelaForm } from '@/shared/services/util/formularioUtil';

// ─── Tipos locais ──────────────────────────────────────────────────────────────

type TipoVariavel = 'String' | 'Boolean' | 'Double' | 'Integer' | 'Object' | 'Json' | 'Float' | 'Date';

interface TipoVariavelOpcao {
  type:  TipoVariavel;
  label: string;
}

interface ColunaTabela {
  key:   string;
  label: string;
}

interface Variavel {
  name:  string;
  type:  TipoVariavel;
  value: any;
}

interface VariavelObjectPayload {
  name:      string;
  value:     any[];
  valueInfo: {
    objectTypeName:          string;
    serializationDataFormat: string;
  };
}

// ─── Valor padrão de nova variável ───────────────────────────────────────────

const VARIAVEL_NOVA: Variavel = { type: 'String', name: '', value: '' };

@Component({
  selector: 'app-tabela-edicao-variavel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FluidModule,
    InputTextModule,
    ButtonModule,
    InputMaskModule,
    CheckboxModule,
    InputNumberModule,
    SelectModule,
    EditorJsonComponent
  ],
  templateUrl: './tabela-edicao-variavel.component.html',
  styleUrl: './tabela-edicao-variavel.component.scss'
})
export class TabelaEdicaoVariavelComponent implements OnInit {

  // ─── Inputs ───────────────────────────────────────────────────────────────

  @Input() colunas:     ColunaTabela[] = [];
  @Input() dados?:      any;
  @Input() variavel?:   Variavel;
  @Input() addVariavel  = false;

  // ─── Outputs ──────────────────────────────────────────────────────────────

  @Output() variavelEmit = new EventEmitter<Variavel | VariavelObjectPayload>();
  @Output() closeEmit    = new EventEmitter<void>();

  // ─── Estado ───────────────────────────────────────────────────────────────

  protected readonly tiposVariavel: TipoVariavelOpcao[] = [
    { type: 'String',  label: 'Texto'           },
    { type: 'Boolean', label: 'Verdadeiro'       },
    { type: 'Double',  label: 'Número decimal'   },
    { type: 'Integer', label: 'Número inteiro'   },
    { type: 'Object',  label: 'Lista'            },
    { type: 'Json',    label: 'Json'             },
    { type: 'Float',    label: 'Decimal'         },
    { type: 'Date',    label: 'Json'             },
  ];

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Inicializa a variável com valores padrão ao adicionar uma nova
    if (this.addVariavel) {
      this.variavel = { ...VARIAVEL_NOVA };
    }

    // Guard: sem variável não há nada a exibir
    if (!this.variavel) return;

    this.sincronizarColunas();
    this.dados = this.variavel.value;
  }

  // ─── Getters ──────────────────────────────────────────────────────────────

  get registro(): any {
    return this.dados;
  }

  // ─── Ações ────────────────────────────────────────────────────────────────

  salvar(): void {
    if (!this.variavel) return;

    if (this.variavel.type === 'Object' && Array.isArray(this.variavel.value)) {
      const payload: VariavelObjectPayload = {
        name:  this.variavel.name,
        value: this.variavel.value,
        valueInfo: {
          objectTypeName:          'java.util.ArrayList',
          serializationDataFormat: 'application/json'
        }
      };
      this.variavelEmit.emit(payload);
    } else {
      this.variavelEmit.emit(this.variavel);
    }
  }

  /**
   * Chamado quando o usuário altera o tipo da variável.
   * Converte o valor atual para o formato adequado ao novo tipo.
   */
  updateType(): void {
    if (!this.variavel) return;

    if (this.variavel.type === 'Object') {
      // Envolve o valor atual em um array (inicia a lista com o valor anterior)
      this.variavel.value = [this.variavel.value];
      this.sincronizarColunas();
    } else if (this.variavel.type === 'Json') {
      this.variavel.value = {};
    }
  }

  adicionarItem(): void {
    if (!this.variavel || this.variavel.type !== 'Object') return;
    if (!Array.isArray(this.variavel.value)) return;

    if (this.isStringArrayValue()) {
      this.variavel.value.push('');
    } else {
      // Constrói um objeto vazio com as chaves das colunas atuais
      const objetoVazio: Record<string, string> = {};
      this.colunas.forEach(col => { objetoVazio[col.key] = ''; });
      this.variavel.value.push(objetoVazio);
    }
  }

  isStringArrayValue(): boolean {
    return isStringArray(this.variavel?.value);
  }

  // ─── Privados ─────────────────────────────────────────────────────────────

  /**
   * Sincroniza `colunas` com base no tipo e valor da variável.
   * - Object: deriva as colunas do valor via utilitário.
   * - Outros: cria uma coluna simples usando o nome da variável.
   */
  private sincronizarColunas(): void {
    if (!this.variavel) return;

    if (this.variavel.type === 'Object') {
      this.colunas = recuperarColunasTabelaForm(this.variavel.value) ?? [];
    } else {
      this.colunas = [{
        key:   this.variavel.name,
        label: this.variavel.name
      }];
    }
  }
}