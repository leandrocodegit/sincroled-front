import { Endereco } from "./endereco.model";
export interface Cliente {
  id?: string;
  nome: string;
  ativo: boolean;
  host: string;
  logo: string;
  email: string;
  endereco?: Endereco;
}
