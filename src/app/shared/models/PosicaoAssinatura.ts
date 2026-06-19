import { SignatarioD4sign } from "./signatario-d4sign.model";

export interface PosicaoAssinatura {
  id: string;
  externalId: string;
  descricao: string;
  color?: string;
  nome: string;
  tipoSignatario: TipoSignatario;
  email: string;
  type: string;
  enabled: boolean;
  ordem: number;
  rubricas: Rubrica[];
  rubrica?: string;
  preferenciasSignatario: any
}

export interface Rubrica {
  id?: string;
  page: number;
  page_height: number;
  page_width: number;
  height?: number;
  width?: number;
  position_left: number;
  position_top: number;
  position_x: number;
  position_y: number;
}

export enum TipoSignatario {
  GRUPO = 'GRUPO',
  USER = 'USER',
  TASK = 'TASK',
  EXTRA = 'EXTRA'
}
