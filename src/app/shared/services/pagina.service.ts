import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginaServico } from '../models/pagina-servico.model';
import { gerarDataForm, gerarVariaveisForm } from './util/formularioUtil';
import { Servico } from '../models/servico.model';


@Injectable({
  providedIn: 'root'
},
)
export class PaginaService {


  constructor(
    private readonly http: HttpClient) { }

  public buscarPagina(paginaId: any): Observable<PaginaServico> {
    return this.http.get<PaginaServico>(`${environment.urlApi}/protocolos/pagina/${paginaId}`);
  }

  public listarPaginas(): Observable<PaginaServico[]> {
    return this.http.get<PaginaServico[]>(`${environment.urlApi}/protocolos/pagina`);
  }

  public criarPagina(pagina: PaginaServico): Observable<PaginaServico> {
    return this.http.post<PaginaServico>(`${environment.urlApi}/protocolos/pagina`, pagina);
  }

  public duplicarPagina(paginaId: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/protocolos/pagina/duplicar/${paginaId}`, {});
  }

  public removerPagina(paginaId: any): Observable<any> {
    return this.http.delete<any>(`${environment.urlApi}/protocolos/pagina/${paginaId}`);
  }

  public habilitarPagina(paginaId: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/protocolos/pagina/${paginaId}`, {});
  }

  public listaPaginasPublicas(): Observable<any[]> {
      return this.http.get<any[]>(`${environment.urlApi}/protocolos/pagina`);
    }
  
    public buscarPaginaServico(paginaId: any): Observable<PaginaServico> {
      return this.http.get<PaginaServico>(`${environment.urlApi}/protocolos/pagina/${paginaId}`);
    }
  
    public buscarFormularioPorSerVico(servicoId: string): Observable<any> {
      return this.http.get<any>(`${environment.urlApi}/protocolos/servico/formulario/${servicoId}`);
    }
  
    public buscarFormulario(id: any, ultimaVersao?: boolean): Observable<any> {
      return this.http.get<any>(`${environment.urlApi}/publico/formulario/${id}?ultimaVersao=${ultimaVersao ?? false}`);
    }
    
    public resolveTarefa(task: any, data: any): Observable<any> {
      return this.http.post<any>(`${environment.urlApi}/processo/api/v1/task/${task.id}/resolve`, { variables: gerarVariaveisForm(task, data) });
    }
  
    public comcluirTarefa(taskId: any): Observable<any> {
      return this.http.post<any>(`${environment.urlApi}/processo/api/v1/task/${taskId}/complete`, {});
    }
  
    public listaFormulariosTarefaAdicional(taskId: any): Observable<any> {
      return this.http.get<any>(`${environment.urlApi}/processo/api/v1/task/${taskId}/variables/formularios-adicionais?deserializeValue=true`, {});
    }
  
    public buscaDadostarefaReenvio(taskId: any): Observable<any> {
      return this.http.get<any>(`${environment.urlApi}/processo/api/v1/task/${taskId}/variables/reenviar_documentos?deserializeValue=false`, {});
    }
  
    public updateDocumentoFormulario(task: any, data: any, sinal?: string): Observable<any> {
      return this.http.post<any>(`${environment.urlApi}/processo/api/update/v1/process-instance/${task.caseInstanceId}/variables?taskId=${task.id}&sinal=${sinal}`, gerarDataForm(data));
    }
  
    public listaVariaveis(taskId: any): Observable<any[]> {
      return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/task/${taskId}/form-variables`, {});
    }
  
    public anexarDocumentoFormulario(task: any, data: any): Observable<any> {
      return this.http.post<any>(`${environment.urlApi}/processo/api/upload/v1/task/${task.id}/forms/create?processInstanceId=${task.caseInstanceId}`, gerarDataForm(data));
    }
  
  } 