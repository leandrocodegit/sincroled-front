import { Parametro } from "./parametro.model";
export class Cor {
  id: string;
  nome: string;
  deviceId?: string;
  time: number;
  tipoAcao: string;
  velocidade: number;
  quantidadePinos: number;
  parametros: Parametro[];

  constructor(
    id = '',
    nome = '',
    deviceId = 0,
    time = 1,
    tipoAcao = 'TODOS',
    velocidade = 0,
    quantidadePinos = 0,
    parametros = []
  ) {
    this.id = id;
    this.nome = nome; 
    this.time = time;
    this.tipoAcao = tipoAcao;
    this.velocidade = velocidade;
    this.quantidadePinos = quantidadePinos;
    this.parametros = parametros;
  }
}
