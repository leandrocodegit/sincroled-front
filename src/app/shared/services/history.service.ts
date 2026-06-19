import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import { getCurrentAfterDate } from './util/DateUtil';
import { ProcessInstance } from '../models/process-instance.model';
import { HistoryProcessInstance } from '../models/history-process-instance.model';
import { HistoricTask } from '../models/history-task.model';
import { Count } from '../models/count.mopdel';
import { HistoryVariableInstance } from '../models/history-variable-instance.model';
import { Incident } from '../models/incident.model';
import { FilterVariableinstance } from '../models/filter-variable-instance.model';
import { trasnformParams } from './util/OpcoesFiltro';


@Injectable({
  providedIn: 'root'
},
)
export class HistoryService {


  constructor(
    private readonly http: HttpClient,
    private readonly oauthService: OAuthService) { }

  public buscarInstancia(processId: any): Observable<HistoryProcessInstance> {
    return this.http.get<HistoryProcessInstance>(`${environment.urlApi}/processo/api/v1/history/process-instance/${processId}`);
  }

  public listarVariaveis(filtro: FilterVariableinstance): Observable<HistoryVariableInstance[]> {
    return this.http.get<HistoryVariableInstance[]>(`${environment.urlApi}/processo/api/v1/history/variable-instance?${trasnformParams(filtro)}`);
  }

  public buscarVariavel(variavelId: any, deserializeValues: boolean = true): Observable<HistoryVariableInstance[]> {
    return this.http.get<HistoryVariableInstance[]>(`${environment.urlApi}/processo/api/v1/history/variable-instance/${variavelId}?deserializeValues=${deserializeValues}`);
  }

  public listarTasksInstancia(instanceId: any): Observable<HistoricTask[]> {
    return this.http.get<HistoricTask[]>(`${environment.urlApi}/processo/api/v1/history/task?processInstanceId=${instanceId}`);
  }

  public listarInstanciasPorProtocolo(businessKey: any): Observable<HistoryProcessInstance[]> {
    return this.http.get<HistoryProcessInstance[]>(`${environment.urlApi}/processo/api/v1/history/process-instance?processInstanceBusinessKey=${businessKey}&sortBy=startTime&sortOrder=desc`);
  }

  public listarInstancias(): Observable<HistoryProcessInstance[]> {
    return this.http.get<HistoryProcessInstance[]>(`${environment.urlApi}/processo/api/v1/history/process-instance?sortBy=startTime&sortOrder=desc`);
  }

  public listarInstanciasRun(query: string): Observable<ProcessInstance[]> {
    return this.http.get<ProcessInstance[]>(`${environment.urlApi}/processo/api/v1/history/process-instance?${query}`);
  }

  public quantidadeInstancias(): Observable<Count> {
    return this.http.get<Count>(`${environment.urlApi}/processo/api/v1/history/process-instance/count`);
  }

  public quantidadeInstanciasConluidas(): Observable<Count> {
    return this.http.get<Count>(`${environment.urlApi}/processo/api/v1/history/process-instance/count?completed=true`);
  }

  public quantidadeInstanciasAbertas(): Observable<Count> {
    return this.http.get<Count>(`${environment.urlApi}/processo/api/v1/history/process-instance/count?completed=false&active=true`);
  }

  public quantidadeInstanciasAbertasHoje(): Observable<Count> {
    return this.http.get<Count>(`${environment.urlApi}/processo/api/v1/history/process-instance/count?completed=false&active=true&startedAfter=${getCurrentAfterDate()}`);
  }

  public listaIncidentesInstancia(processInstanceId: any): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${environment.urlApi}/processo/api/v1/history/incident?processInstanceId=${processInstanceId}`);
  }

  public listaOperacoesUsuario(filtro: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/history/user-operation?maxResults=200&sortBy=timestamp&sortOrder=desc&${filtro}`);
  }

  public filtrarTarefas(filter: any): Observable<any[]> {
    return this.http.post<any[]>(`${environment.urlApi}/processo/api/v1/history/task`, filter);
  }

  public filtrarInstancias(filter: any, query?: string): Observable<any[]> {
    return this.http.post<any[]>(`${environment.urlApi}/processo/api/v1/history/process-instance?${query}`, filter);
  }
}
