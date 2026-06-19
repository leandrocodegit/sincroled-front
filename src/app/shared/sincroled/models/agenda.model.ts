import { Cor } from "./cor.model";
import { Dispositivo } from "./dispositivo.model";


export class Agenda {
  id: string;
  nome: string;
  ativo: boolean;
  status: 'Parada' | 'Executando' | string; // Baseado no seu JSON "Parada"
  execucao: Date | null;
  inicio: string | Date;    // "2026-08-12"
  termino: string | Date;   // "2026-08-12"
  cor?: any;
  dispositivos: Dispositivo[];   // Array de IDs de hardware [5021]
  todos: boolean;
  estaNoPrazo: boolean;

  constructor(dados?: Partial<Agenda>) {
    this.id = dados?.id || crypto.randomUUID();
    this.nome = dados?.nome || '';
    this.ativo = dados?.ativo ?? false;
    this.status = dados?.status || 'Parada';
    this.execucao = dados?.execucao ? new Date(dados.execucao) : null;
    this.inicio = dados?.inicio || '';
    this.termino = dados?.termino || '';
    this.dispositivos = dados?.dispositivos || [];
    this.todos = dados?.todos ?? false;
    this.estaNoPrazo = dados?.estaNoPrazo ?? false;
    this.cor = dados?.cor ?? undefined;
  }

}


export class AgendaRequest {
  id?: string;
  nome: string;
  ativo: boolean;
  execucao: Date | null;
  inicio: string | Date;
  termino: string | Date;
  cor?: any;
  dispositivos: string[];
  todos: boolean;

  constructor(dados?: Partial<AgendaRequest>) {
     this.id = dados?.id || undefined;
    this.nome = dados?.nome || '';
    this.ativo = dados?.ativo ?? false;
    this.execucao = dados?.execucao ? new Date(dados.execucao) : null;
    this.inicio = dados?.inicio || '';
    this.termino = dados?.termino || '';
    this.dispositivos = dados?.dispositivos || [];
    this.todos = dados?.todos ?? false;
    this.cor = dados?.cor ?? undefined;
  }

}
