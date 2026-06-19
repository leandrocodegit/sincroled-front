import { HttpClient } from '@angular/common/http';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Page } from '../../models/Page';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Agenda, AgendaRequest } from '../models/agenda.model';
import { Injectable } from '@angular/core';
import { Dashboard } from '../models/dashboard.model';



@Injectable({
  providedIn: 'root'
},
)
export class DashboardService {

  constructor(
    private readonly http: HttpClient) { }

  public buscarDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${environment.urlApi}/dashboard`)
  }
}

