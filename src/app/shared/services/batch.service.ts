import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Job } from '../models/job.model';


@Injectable({
  providedIn: 'root'
},
)
export class BatchService {


  constructor(private readonly http: HttpClient) { }


  public executarJob(lote: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/process-instance/suspended-async`, lote);
  }

  public executarJobVariavel(lote: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/process-instance/variables-async`, lote);
  }

    public executarModificacoes(request: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/processo/api/v1/modification/executeAsync`, request);
  }

  public listaLotes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/batch`);
  }

  public listaLotesStatisticos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/batch/statistics?noLoad=true`);
  }

  public suspenderLote(loteId: string, susepnder: boolean): Observable<any> {
    return this.http.put<any>(`${environment.urlApi}/processo/api/v1/batch/${loteId}/suspended`, {
      suspended: susepnder
    });
  }

  public listaHitoricoLotes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/history/batch?maxResults=200`);
  }


  public removerLote(loteId: string): Observable<any> {
    return this.http.delete<any>(`${environment.urlApi}/processo/api/v1/batch/${loteId}`);
  }

}
