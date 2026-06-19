export interface Configificacao {
  leds: number;
  intensidade: number;
  faixa: number;
  tipoCor: string;
  ativo: boolean;
}

export interface ParametroEfeito {
  pino: number;
  efeito: string;
  cor: number[];
  corHexa: string[];
  correcao: number[];
  configuracao: Configificacao;
}

export interface ComandoCor {
  id: string;
  nome: string;
  time: number;
  quantidadePinos: number;
  rapida: boolean;
  vibracao: boolean;
  exclusiva: boolean;
  velocidade: number;
  parametros: ParametroEfeito[];
  responder: boolean;
}
