import { Agenda } from "./agenda.model";
import { Comando } from "./constantes/comando";
import { DashboardItem } from "./dashboard-item.model";
import { Logconexao } from "./log-conexao.model";


export interface Dashboard {
  usuariosAtivos: number;
  usuariosInativos: number;
  dispositivos: DispositivoDash;
  agendasMes: Agenda[];
  cores: DashboardItem[];
  agendas: DashboardItem[];
  agendasExecucao: DashboardItem[];
  logsConexao: Logconexao[];
  logs: Log[];
  logsHoje: number
}


export interface DispositivoDash {
  total: number;
  online: number;
  offline: number;
}

export interface Log {
  id: number;
  descricao: string;
  mensagem: string;
  comando: Comando;
  data: Date;
  tipoLog: any;
}

