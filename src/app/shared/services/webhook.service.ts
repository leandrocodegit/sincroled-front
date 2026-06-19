import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import 'leaflet-draw';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
},
)
export class WebHookService {


  constructor(
      private readonly http: HttpClient) { }


    public buscarAgenda(webhook: string): Observable<any> {
      return this.http.post<any>(`${environment.urlApi}/webhook/${webhook}`, {});
    }

        public buscarAgendas(webhook: string): Observable<any> {
      return this.http.post<any>(`http://192.168.15.200:5678/webhook/${webhook}`, {});
    }
}
