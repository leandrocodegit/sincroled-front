import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Incident } from '../models/incident.model';
import { Count } from '../models/count.mopdel';


@Injectable({
  providedIn: 'root'
},
)
export class IncidentService {


  constructor(private readonly http: HttpClient) { }


  public listaIncidentesInstancia(filtro: string): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${environment.urlApi}/processo/api/v1/incident?${filtro}`);
  }

  public historicoIncidentesInstancia(filtro: string): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${environment.urlApi}/processo/api/v1/history/incident?${filtro}`);
  }

  public quantidadeIncidentes(filtro: string): Observable<Count> {
    return this.http.get<Count>(`${environment.urlApi}/processo/api/v1/incident/count?${filtro}`);
  }

  public removerIncidente(incidentId: string): Observable<any> {
    return this.http.delete<any>(`${environment.urlApi}/processo/api/v1/incident/${incidentId}`);
  }


}
