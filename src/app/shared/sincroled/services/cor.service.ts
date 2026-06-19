import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PageEvent } from '@angular/material/paginator';
import { Page } from '../../models/Page';
import { Sort } from '@angular/material/sort';
import { Cor } from '../models/cor.model';
import { Parametro } from '../models/parametro.model';



@Injectable({
  providedIn: 'root'
},
)
export class CorService {

  public carregarLista = new EventEmitter

  constructor(
    private readonly http: HttpClient) { }

  public listaCores(tipoACao?: string[]): Observable<Page<Cor>> {
    return this.http.get<Page<Cor>>(`${environment.urlApi}/cor?${tipoACao ? `tipoAcao=${tipoACao}` : ''}`)
  }

  public salvarCor(cor: Cor): Observable<Cor> {
    return this.http.post<Cor>(`${environment.urlApi}/cor`, cor)
  }

  public salvarParametro(deviceId: string, param: Parametro): Observable<any> {
    return this.http.post(`${environment.urlApi}/cor/parametro/${deviceId}`, param)
  }

  public salvarParametros(params: Parametro[]): Observable<any> {
    return this.http.post(`${environment.urlApi}/cor/parametros`, params)
  }

  public salvarVibracao(cor: Cor): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/cor/vibracao`, cor)
  }

  public salvarVelocidade(cor: Cor): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/cor/velocidade`, cor)
  }

  public duplicarCor(configuracao: Cor): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/cor/duplicar`, configuracao)
  }

  public listaTodasConfiguracoes(rapida: boolean, vibracao: boolean, exclusiva: boolean, sort?: Sort, page?: PageEvent): Observable<Page<Cor>> {
    if (!sort) {
      sort = {
        active: 'nome',
        direction: 'asc'
      }
    }
    return this.http.get<Page<Cor>>(`${environment.urlApi}/cor/${rapida}/${vibracao}/${exclusiva}?page=${page?.pageIndex}&size=${page?.pageSize}&sort=${sort?.active},${sort?.direction}`, environment.headers)
  }

  public buscarCor(id: number): Observable<Cor> {
    return this.http.get<Cor>(`${environment.urlApi}/cor/${id}`, environment.headers)
  }

  public removerCor(id: string): Observable<Cor[]> {
    return this.http.delete<Cor[]>(`${environment.urlApi}/cor/${id}`, environment.headers)
  }


}
