export interface FormularioSchema {
  nome: string;
  campos: FormComponent[];
}

export interface FormComponent {
  id: string;
  key: string;
  label: string;
  type: string;
  action: string;
  validate?: FormValidate
}

export interface FormValidate {
  required?: boolean;
}
