import { HttpClient } from '@angular/common/http';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Page } from '../../models/Page';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Agenda, AgendaRequest } from '../models/agenda.model';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
},
)
export class AgendaService {

  constructor(
    private readonly http: HttpClient) { }

  public criarAgenda(agenda: AgendaRequest): Observable<Agenda> {
    return this.http.post<Agenda>(`${environment.urlApi}/agenda`, agenda)
  }

  public alterarAgenda(agenda: AgendaRequest, removerConflitos: boolean): Observable<Agenda> {
    return this.http.patch<Agenda>(`${environment.urlApi}/agenda/${removerConflitos}`, agenda)
  }

  public listaAgendasMesAtual(page?: PageEvent): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${environment.urlApi}/agenda/mes`)
  }

  public ativarAgenda(agendaId: string): Observable<any> {
    return this.http.put(`${environment.urlApi}/agenda/ativar/${agendaId}`, {})
  }

  public listaTodosAgendas(sort?: Sort, page?: PageEvent): Observable<Page<Agenda>> {
    if (!sort) {
      sort = {
        active: 'nome',
        direction: 'asc'
      }
    }
    return this.http.get<Page<Agenda>>(`${environment.urlApi}/agenda?page=${page?.pageIndex}&size=${page?.pageSize}&sort=${sort?.active},${sort?.direction}`)
  }

  public listaTodosAgendasPorDispositivo(id: number): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${environment.urlApi}/agenda/dispositivo/${id}`)
  }

  public listaTodosAgendasPorConfiguracao(id: number): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${environment.urlApi}/agenda/dispositivo/${id}`)
  }

  public removerAgenda(id: string): Observable<Agenda[]> {
    return this.http.delete<Agenda[]>(`${environment.urlApi}/agenda/${id}`)
  }
}

