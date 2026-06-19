import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Job } from '../models/job.model';
import { JobDefinitionRequest } from '../models/job-definition-request.model';


@Injectable({
  providedIn: 'root'
},
)
export class JobDefinitionService {


  constructor(private readonly http: HttpClient) { }


  public listaDefinicoes(filtro?: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/job-definition?maxResults=200${filtro ? '&' : ''}${filtro}`);
  }

    public suspenderJobDefinition(jobDefinitionId: string, request: JobDefinitionRequest): Observable<any> {
    return this.http.put<any>(`${environment.urlApi}/processo/api/v1/job-definition/${jobDefinitionId}/suspended`, request);
  }

  public listaHistoricoJobLogs(filtro?: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/history/job-log?maxResults=200${filtro ? '&' : ''}${filtro}`);
  }

  public listaJobsPendentesInstancia(processInstanceId: any): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.urlApi}/processo/api/v1/job?processInstanceId=${processInstanceId}`);
  }

  public executarJob(jobId: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/job/${jobId}/execute`, {});
  }

  public retryJob(jobId: string, request: any): Observable<any> {
    return this.http.put<any>(`${environment.urlApi}/processo/api/v1/job/${jobId}/retry`, request);
  }

  public retriesJob(jobId: string, request: any): Observable<any> {
    return this.http.put<any>(`${environment.urlApi}/processo/api/v1/job/${jobId}/retries`, request);
  }



  public getStakStrace(logId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/history/job-log/${logId}/stacktrace?mediaType=text/plain`, { responseType: 'text' as any });
  }

}
