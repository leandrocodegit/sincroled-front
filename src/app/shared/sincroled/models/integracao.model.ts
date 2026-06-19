import { Dispositivo } from "./dispositivo.model";


export interface Integracao {
  id: string;
  nome: string;
  ativo: boolean;
  origem: string;
  dispositivo: Dispositivo;
}
