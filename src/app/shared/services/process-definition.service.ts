import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { getCurrentAfterDate, getCurrentBeforeDate } from '@/shared/services/util/DateUtil';
import { RestarProcess } from '../models/process-restart.model';


@Injectable({
  providedIn: 'root'
},
)
export class ProcessDefinitionService {


  constructor(
    private readonly http: HttpClient) { }

  public latestVersionProcessKey(key: any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/process-definition?key=${key}&latestVersion=true&maxResults=1`);
  }

    public listaProcessDefinitions(query: any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/process-definition?${query}`);
  }

  public buscarProcessById(key: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-definition/${key}`);
  }

  public buscarFluxo(taskId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-definition/${taskId}/xml`);
  }

  public buscarIndentity(taskId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/task/${taskId}/identity-links`);
  }

  public listarActivity(processDefinitionId: string, processInstanceId?: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/simod-rest/base/timeline/${processDefinitionId}/${processInstanceId}`);
  }

  public listarProcessoPorSource(sourceId: any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/process-definition?source=${sourceId}`);
  }

  public listarProcessoPorKey(key: any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/process-definition?key=${key}&sortBy=version&sortOrder=desc`);
  }

  public quantidadeProcesso(): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-definition/count`);
  }

  public quantidadeProcessoAtivos(active: boolean): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-definition/count?active=${active}`);
  }

  public quantidadeProcessoSuspenso(suspended: boolean): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-definition/count?active=true&suspended=${suspended}`);
  }

  public restarProcesso(restart: RestarProcess): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/process-definition/${restart.processId}/restart`, restart);
  }

  public buscarFormularopTarefa(taskId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/task/${taskId}/deployed-form`);
  }

  public quantidadeTarefas(): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/task/count`);
  }

  public quantidadeTarefasVencemHoje(): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/task/count?dueBefore=${getCurrentBeforeDate()}&dueAfter=${getCurrentAfterDate()}`);
  }

  public removerTarefa(tarefaId: any): Observable<any> {
    return this.http.delete<any>(`${environment.urlApi}/processo/api/v1/task/${tarefaId}`);
  }

  public assumirTarefa(task: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/task/${task.taskId}/claim`, task);
  }

  public desassumirTarefa(taskId: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/task/${taskId}/unclaim`, {});
  }

  public historicoTarefa(taskId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/history/user-operation?taskId=${taskId}&sortBy=timestamp&sortOrder=desc`);
  }

  public getProcessStatistics(processDefinitionId: any): Observable<any> {
    //&incidentsForType=<string>
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-definition/${processDefinitionId}/statistics?failedJobs=true&incidents=true`);
  }

  public getHistoryProcessStatistics(processDefinitionId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/history/process-definition/${processDefinitionId}/statistics`);
  }

  public getStaticCalledProcessDefinitions(processDefinitionId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-definition/${processDefinitionId}/static-called-process-definitions`);
  }

  public getIncidentProcessDefinitions(processDefinitionId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/incident?processDefinitionId=${processDefinitionId}`);
  }

    public listaActivities(processDefinitionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/simod-rest/base/activities/${processDefinitionId}`);
  }
}
