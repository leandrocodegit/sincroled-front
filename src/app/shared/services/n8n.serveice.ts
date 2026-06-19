import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { N8nHttpRequestNode, PublicarWorkflowRequest, WrokFlowData } from '../models/node-data.model';

@Injectable({
  providedIn: 'root'
},
)
export class N8NService {


  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1N2Y0NjE5Zi02NzAwLTQyOTAtYmQ5Zi01OTAxYWMxMDk0ODgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY5NjAwMTUxfQ.5bZKhMZ8I9P_CHdHaEvFOObOQD9KkRc-Pfi0negWU0A'

  constructor(
    private readonly http: HttpClient,) { }

  public listaWorkFlows(): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/n8n/workflows?tags=simod`, {
      headers: {
        'X-N8N-API-KEY': this.token
      }
    });
  }

  public listaWorkFlowsGlobal(): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/n8n/workflows?tags=global`, {
      headers: {
        'X-N8N-API-KEY': this.token
      }
    });
  }

  public listaExecusoes(workFlowId: string): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/n8n/executions?workflowId=${workFlowId}`, {
      headers: {
        'X-N8N-API-KEY': this.token
      }
    });
  }

  public refazerExecucao(executionId: string): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/n8n/executions/${executionId}/retry`, {
      loadWorkflow: true
    }, {
      headers: {
        'X-N8N-API-KEY': this.token
      }
    });
  }

  public buscarExecucao(executionId: string, includeData?: boolean): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/n8n/executions/${executionId}?includeData=${includeData}`, {
      headers: {
        'X-N8N-API-KEY': this.token
      }
    });
  }

  public removerExecucao(executionId: string): Observable<any> {
    return this.http.delete<any>(`${environment.urlApi}/n8n/executions/${executionId}`, {
      headers: {
        'X-N8N-API-KEY': this.token
      }
    });
  }

  public publicar(idWorkFlow: string, request: PublicarWorkflowRequest): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/n8n/workflows/${idWorkFlow}/activate`, request, {
      headers: {
        'X-N8N-API-KEY': this.token
      }
    });
  }

  public desPublicar(idWorkFlow: string): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/n8n/workflows/${idWorkFlow}/deactivate`, {}, {
      headers: {
        'X-N8N-API-KEY': this.token
      }
    });
  }



}
