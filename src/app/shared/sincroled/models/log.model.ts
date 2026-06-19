import { Configuracao } from "./configuracao.model";
import { Comando } from "./constantes/comando";


export interface Log {
  id: number;
  usuario: string;
  descricao: string;
  comando: Comando;
  data: Date;
  configuracao: Configuracao;

}
