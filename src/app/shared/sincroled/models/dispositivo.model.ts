import { Cor } from "./cor.model";
import { Comando } from "./constantes/comando";
import { Endereco } from "./endereco.model";
import { Agenda } from "./agenda.model";
import { Cliente } from "./cliente.model";


export interface Dispositivo {
  selecionado: boolean;
  id: string;
  cliente?: Cliente;
  clienteId: string;
  nome: string;
  ip: string;
  versao: string;
  modelo: string;
  ignorarAgenda: boolean;
  memoria: number;
  ativo: boolean;
  permiteComando: boolean;
  conexao: Conexao;
  cor: Cor;
  comando: Comando,
  endereco?: Endereco,
  enderecoCompleto: string;
  timer: boolean;
  operacao: Operacao;
  sensibilidadeVibracao: number;
  tempoEvento: number;
  tipoCor: string;
}

export interface Conexao
{
  ultimaAtualizacao: string;
  status: string;
  tipoConexao: string;
  statusMCU: string;
  habilitarEth: boolean;
  habilitarWifi: boolean;
  wifiConectado: boolean;
  ssid: string;
  ip: string;
  senha: string;
  btHabilitado: boolean;
  vbHabilitado: boolean;
  modoLora: number;
  classe: String;
  devEui: String;
  appEui: String;
  appKey: String;
  nwkSKey: String;
  appSKey: String;
  devAddr: String;
  txPower: number;
  dataRate: number;
  adr: boolean;
  snr: number;
  wifiRssi: number;
  autoJoin: boolean;
  fracionarMensagem: boolean;
  latitude: number;
  longitude: number;
}

interface Operacao
{
  modoOperacao: string;
  corTemporizador: Cor;
  corVibracao?: Cor;
  corBotao?: Cor;
  time: Date;
  agenda: Agenda
}
