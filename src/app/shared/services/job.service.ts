import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Job } from '../models/job.model';
import { Count } from '../models/count.mopdel';


@Injectable({
  providedIn: 'root'
},
)
export class JobService {


  constructor(private readonly http: HttpClient) { }

  public listaJobsInstancia(processInstanceId: any, active?: boolean): Observable<Job[]> {
    if (active)
      return this.http.get<Job[]>(`${environment.urlApi}/processo/api/v1/job?processInstanceId=${processInstanceId}&active=true`);
    return this.http.get<Job[]>(`${environment.urlApi}/processo/api/v1/job?processInstanceId=${processInstanceId}`);
  }

  public listaJobs(filtro?: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/job?maxResults=500&${filtro}`);
  }

    public quantidadeJobs(filtro?: string): Observable<Count> {
    return this.http.get<Count>(`${environment.urlApi}/processo/api/v1/job/count?maxResults=500&${filtro}`);
  }

  public listaHistoricoJobLogs(filtro?: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/history/job-log?maxResults=500${filtro ? '&' : ''}${filtro}`);
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

  public suspenderJob(request: any): Observable<any> {
    return this.http.put<any>(`${environment.urlApi}/processo/api/v1/job/suspended`, request);
  }

  public getStakStrace(logId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/history/job-log/${logId}/stacktrace?mediaType=text/plain`, { responseType: 'text' as any });
  }

}
