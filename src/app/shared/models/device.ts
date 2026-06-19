export interface DeviceResponse {
  content: Device[];
}

export interface Device {
  id: number;
  nome: string;
  versao: string;
  ativo: boolean;
  comando: string;
  permiteComando: boolean;
  sensibilidadeVibracao: number;
  cliente?: {
    nome: string;
  };
  operacao: {
    modoOperacao: string;
    agenda?: {
      nome: string;
      status: string;
      inicio: string;
      termino: string;
    };
  };
  conexao: {
    status: string;
    tipoConexao: string;
    statusMCU: string;
    ultimaAtualizacao: string;
  };
  cor?: {
    nome: string;
    parametros: Array<{
      efeito: string;
      corHexa: string[];
      configuracao: {
        leds: number;
        intensidade: number;
      };
    }>;
  };
}
