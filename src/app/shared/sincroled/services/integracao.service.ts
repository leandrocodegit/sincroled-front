import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Page } from '../../models/Page';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Integracao } from '../models/integracao.model';



@Injectable({
  providedIn: 'root'
},
)
export class IntegracaoService {

  public carregarLista = new EventEmitter

  constructor(
    private readonly http: HttpClient) { }

  public testIntegracao(host: string): Observable<any> {
    return this.http.get<any>(host)
  }

  public criarIntegracao(integracao: { nome: string, dispositivo: string, origem: string, cor: string }): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/integracao`, integracao)
  }

  public listaTodasIntegracoes(page?: PageEvent): Observable<Page<Integracao>> {
    return this.http.get<Page<Integracao>>(`${environment.urlApi}/integracao?page=${page?.pageIndex}&size=${page?.pageSize}`, environment.headers)
  }

  public removerIntegracao(nome: string): Observable<any> {
    return this.http.delete<any>(`${environment.urlApi}/integracao/${nome}`, environment.headers)
  }


}
