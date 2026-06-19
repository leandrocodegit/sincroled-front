import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permissao } from '../models/permissoes.model';
import { ExternalTask } from '../models/external-task.model';


@Injectable({
  providedIn: 'root'
},
)
export class ExternalTaskService {


  constructor(private readonly http: HttpClient) { }

  public buscarTarefaExterna(externalTaskId: string): Observable<ExternalTask> {
    return this.http.get<ExternalTask>(`${environment.urlApi}/processo/api/v1/external-task/${externalTaskId}`);
  }

  public buscarHistoricosTarefaExterna(filtro: string): Observable<ExternalTask[]> {
    return this.http.get<ExternalTask[]>(`${environment.urlApi}/processo/api/v1/history/external-task-log?${filtro}&sortBy=timestamp&sortOrder=desc`);
  }

  public buscarHistoricoTarefaExterna(externalTaskId: string): Observable<ExternalTask> {
    return this.http.get<ExternalTask>(`${environment.urlApi}/processo/api/v1/history/external-task-log/${externalTaskId}`);
  }

  public listarTarefas(processInstanceId: any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/external-task?processInstanceId=${processInstanceId}`);
  }

  public listarTarefasFiltro(filtro: any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/external-task?${filtro}`);
  }

  public listarTopicos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/external-task/topic-names`);
  }

  public detalhesErro(externalTaskId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/external-task/${externalTaskId}/errorDetails?mediaType=text/plain`);
  }

  public completarTarefa(task: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/external-task/${task.id}/complete`, task);
  }

  public notificarFalhaTarefa(externalTaskId: string, request: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/external-task/${externalTaskId}/failure`, request);
  }

  public destravarTarefa(task: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/external-task/${task.id}/unlock`, {});
  }

  public finalizarComErroBpmn(externalTaskId: string, request: { workerId: string, errorCode: string, errorMessage: string }): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/external-task/${externalTaskId}/bpmnError`, request);
  }

  public travarTarefa(task: any, lockDuration: number): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/external-task/${task.id}/lock`, {
      lockDuration: lockDuration,
      workerId: task.workerId
    });
  }

  public alterarRitriesTarefaInstancia(task: any): Observable<any> {
    task.retries = 2;
    return this.http.put<any>(`${environment.urlApi}/processo/api/v1/external-task/retries`, task);
  }

  public alterarRitriesTarefa(externalTaskId: any, retries: number): Observable<any> {
    return this.http.put<any>(`${environment.urlApi}/processo/api/v1/external-task/${externalTaskId}/retries`, {
      "retries": retries
    });
  }

}
