import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from 'src/app/shared/models/Page';
import { Servico } from '../models/servico.model';
import { Agenda, HorarioAgenda } from '@/shared/formularios-uteis/models/agenda.model';


@Injectable({
  providedIn: 'root'
},
)
export class AgendaService {


  constructor(
    private readonly http: HttpClient) { }


  public buscarAgenda(servicoId: any): Observable<Agenda> {
    return this.http.get<Agenda>(`${environment.urlApi}/protocolos/agenda/${servicoId}`);
  }

  public listarAgendas(): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${environment.urlApi}/protocolos/agenda`);
  }

  public criarAgenda(agenda: Agenda): Observable<Agenda> {
    return this.http.post<Agenda>(`${environment.urlApi}/protocolos/agenda`, agenda);
  }

  public duplicarAgenda(agendaId: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/protocolos/agenda/duplicar/${agendaId}`, {});
  }

  public removerAgenda(agendaId: any): Observable<any> {
    return this.http.delete<any>(`${environment.urlApi}/protocolos/agenda/${agendaId}`);
  }

  public habilitarAgenda(agendaId: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/protocolos/agenda/active/${agendaId}`, {});
  }

  public gerarHorarios(request: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/protocolos/agenda/gerar`, request);
  }

  // Hrários da agenda

  public listarHorariosAgendas(agendaId: string, disponiveis: boolean = true): Observable<HorarioAgenda[]> {
    return this.http.get<HorarioAgenda[]>(`${environment.urlApi}/protocolos/horario-agenda?agendaId=${agendaId}&disponiveis=${disponiveis}`);
  }

  public listarProtocoladasPorData(data: string, sort: any): Observable<Page<HorarioAgenda>> {
    return this.http.get<Page<HorarioAgenda>>(`${environment.urlApi}/protocolos/horario-agenda/protocoladas/${data}/agenda?${sort}`);
  }

  public listarAgendasProtocoladas(data: string): Observable<{ horarios: HorarioAgenda[], diasIndisponiveis: Date[] }> {
    return this.http.get<{ horarios: HorarioAgenda[], diasIndisponiveis: Date[] }>(`${environment.urlApi}/protocolos/horario-agenda/protocoladas/${data}`);
  }

  public listarHorariosAgendaPorData(agendaId: string, data: string, forceMes: boolean = false): Observable<{ horarios: HorarioAgenda[], diasIndisponiveis: Date[] }> {
    return this.http.get<{ horarios: HorarioAgenda[], diasIndisponiveis: Date[] }>(`${environment.urlApi}/protocolos/horario-agenda/periodo/${agendaId}?dataInicio=${data}&forceMes=${forceMes}`);
  }

  public habilitarHorario(horarioId: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/protocolos/horario-agenda/active/${horarioId}`, {});
  }

  public removerHorarioAgenda(horarioId: any): Observable<any> {
    return this.http.delete<any>(`${environment.urlApi}/protocolos/agenda/${horarioId}`);
  }

  public reservarHorarios(horariosId: string[]): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/protocolos/horario-agenda/reservar`, horariosId);
  }

  public downloadProtocoloAgenda(id: string): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/protocolos/horario-agenda/download/${id}`, { responseType: 'blob' as 'json' });
  }
}
