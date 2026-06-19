import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Page } from '../../models/Page';
import { Cliente } from '../models/cliente.model';



@Injectable({
  providedIn: 'root'
},
)
export class ClienteService {

  constructor(
    private readonly http: HttpClient) { }

  public salvarCliente(cliente: Cliente): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/cliente`, cliente, environment.headers)
  }

  public ativarCleinte(cliente: String): Observable<any> {
    return this.http.put<any>(`${environment.urlApi}/cliente/ativar/${cliente}`, {})
  }

  public buscarCliente(): Observable<Cliente> {
    return this.http.get<Cliente>(`${environment.urlApi}/cliente/detalhes`)
  }

  public removerCliente(cliente: Cliente): Observable<any> {
    return this.http.delete<any>(`${environment.urlApi}/cliente/${cliente.id}`)
  }

  public pesquisarCliente(ativo: boolean, pesquisa: string): Observable<Page<Cliente>> {
    return this.http.get<Page<Cliente>>(`${environment.urlApi}/cliente/pesquisar/${ativo}/${pesquisa}`, environment.headers)
  }



  public buscarClienteLogado(): Observable<Cliente> {
    return this.http.get<Cliente>(`${environment.urlApi}/cliente/detalhes`, environment.headers)
  }

  public listaClientes(): Observable<Page<Cliente>> {
    return this.http.get<Page<Cliente>>(`${environment.urlApi}/cliente`)
  }

}
