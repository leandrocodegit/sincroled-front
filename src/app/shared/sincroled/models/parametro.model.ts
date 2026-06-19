import { Configuracao } from "./configuracao.model";
import { Efeito } from "./constantes/Efeito";
export class Parametro {
  pino: number;
  efeito?: Efeito;
  cor: number[];
  corHexa: string[];
  correcao: number[];
  leds: number;
  faixa: number;
  intensidade: number;
  tipoCor: string;

  constructor(
    id = '',
    pino = 0,
    efeito = Efeito.COLORIDO,
    cor = [0, 0, 255, 255, 0, 0, 0, 255, 0],
    corHexa = ['red', 'green', 'blue'],
    correcao = [255, 255, 255],
    leds = 0,
    faixa = 0,
    intensidade = 255,
    tipoCor = 'RGB',

  ) {
    this.pino = pino;
    this.efeito = efeito;
    this.cor = cor;
    this.corHexa = corHexa;
    this.correcao = correcao;
    this.leds = leds;
    this.faixa = faixa;
    this.intensidade = intensidade;
    this.tipoCor = tipoCor;
  }
}

