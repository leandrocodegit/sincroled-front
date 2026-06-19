import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import { ProcessInstance } from '../models/process-instance.model';
import { Count } from '../models/count.mopdel';
import { VariableTypedMap } from '../models/variable-typed-map .model';


@Injectable({
  providedIn: 'root'
},
)
export class InstanciaService {

  private detalhesInstancia = new Subject<any>();
  private _updateInstancia = new Subject<any>();
  private _closeLote = new Subject<any>();
  public updateInstancia = this._updateInstancia.asObservable()
  public closeLote = this._closeLote.asObservable()

  constructor(
    private readonly http: HttpClient) { }

  detalhesInstancia$ = this.detalhesInstancia.asObservable();

  show(value: any) {
    this.detalhesInstancia.next(value);
  }

  hide() {
    this.detalhesInstancia.next({
      view: false
    });
  }

  notificarAtualizacaoInstancia() {
    this._updateInstancia.next(true);
  }

  fecharLote() {
    this._closeLote.next(true);
  }

  public buscarInstancia(instanceId: any): Observable<ProcessInstance> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-instance/${instanceId}`);
  }

  public buscarActivityInstancia(instanceId: any): Observable<ProcessInstance> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-instance/${instanceId}/activity-instances`);
  }

  public buscarInstanciaPorProtocolo(businessKey: any): Observable<ProcessInstance[]> {
    return this.http.get<ProcessInstance[]>(`${environment.urlApi}/processo/api/v1/process-instance?businessKey=${businessKey}`);
  }

  public buscarVencimentoInstancia(instanceId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-instance/${instanceId}/variables/data_vencimento?noLoad=true`);
  }

  public buscarFormularioCadastro(instanceId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-instance/${instanceId}/variables/formKey?noLoad=true`);
  }

  public buscarVariableName(instanceId: any, varName: string, deserializeValue?: boolean): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-instance/${instanceId}/variables/${varName}?deserializeValue=${deserializeValue ?? true}&noLoad=true`);
  }

  public listarVariaveis(instanceId: any): Observable<VariableTypedMap[]> {
    return this.http.get<VariableTypedMap[]>(`${environment.urlApi}/processo/api/v1/variable-instance?processInstanceIdIn=${instanceId}`);
  }

  public filtrarVariaveis(filtro: any): Observable<VariableTypedMap[]> {
    return this.http.get<VariableTypedMap[]>(`${environment.urlApi}/processo/api/v1/variable-instance?${filtro}`);
  }

  public listarProcessos(): Observable<any[]> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/process-definition`);
  }

  public comentariosInstancia(instanceId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/v1/simod-rest/base/comment/${instanceId}`);
  }

  public timeLine(processDefinitionId: string, processInstanceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/simod-rest/base/timeline/${processDefinitionId}/${processInstanceId}?noLoad=true`);
  }

  public fluxoOrg(processDefinitionId: string, processInstanceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/simod-rest/base/timeline/${processDefinitionId}/${processInstanceId}/org?noLoad=true`);
  }

  public listaAnexosInstancia(taskId: any): Observable<any[]> {
    return this.http.get<any>(`${environment.urlApi}/processo/api/upload/v1/simod-rest/base/attachment/${taskId}`, {});
  }

  public atualizarLinkDocumentosAprovacao(instanceId: any, varName: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/processo/api/v1/simod-rest/base/update/link/${instanceId}/${varName}`);
  }

  public listarInstanciasAtivas(page?: any): Observable<ProcessInstance[]> {
    return this.http.get<ProcessInstance[]>(`${environment.urlApi}/processo/api/v1/process-instance?active=true&${page}`);
  }

  public fitrarInstanciasProcessos(filtro: any, page?: any): Observable<ProcessInstance[]> {
    return this.http.get<ProcessInstance[]>(`${environment.urlApi}/processo/api/v1/process-instance?${filtro}&${page}`);
  }

  public listarInstanciasProcessos(processId: any, page?: any): Observable<ProcessInstance[]> {
    return this.http.get<ProcessInstance[]>(`${environment.urlApi}/processo/api/v1/process-instance?processDefinitionId=${processId}&${page}`);
  }

  public countInstanciasAtivas(): Observable<Count> {
    return this.http.get<Count>(`${environment.urlApi}/processo/api/v1/process-instance/count?active=true`);
  }

  public buscarInstanciasAtivaPorPortocolo(businessKey: string): Observable<Count> {
    return this.http.get<Count>(`${environment.urlApi}/processo/api/v1/process-instance/count?businessKey=${businessKey}&active=true`);
  }

  public countInstanciasProcessos(processId: any): Observable<Count> {
    return this.http.get<Count>(`${environment.urlApi}/processo/api/v1/process-instance/count?processDefinitionId=${processId}`);
  }

  public quantidadeInstanciasProcessos(processId: any): Observable<Count> {
    return this.http.get<Count>(`${environment.urlApi}/processo/api/v1/process-instance/count?processDefinitionId=${processId}`);
  }

  public quantidadeInstanciasAtivasProcessos(processId: any): Observable<Count> {
    return this.http.get<Count>(`${environment.urlApi}/processo/api/v1/process-instance/count?processDefinitionId=${processId}&active=true`);
  }

  public ativarInstancia(instanceId: any, suspended: boolean): Observable<any> {
    return this.http.put<any>(`${environment.urlApi}/processo/api/v1/process-instance/${instanceId}/suspended`, {
      suspended: suspended
    });
  }

  public alterarVariavel(instanceId: any, variavel: any, parametros?: string): Observable<any> {
    return this.http.put<any>(`${environment.urlApi}/processo/api/v1/process-instance/${instanceId}/variables/${variavel.name}?${parametros ?? ''}`, variavel);
  }

  public removerVariavel(instanceId: any, variavel: any): Observable<any> {
    return this.http.delete<any>(`${environment.urlApi}/processo/api${variavel?.type == 'File' ? '/upload' : ''}/v1/process-instance/${instanceId}/variables/${variavel.name}`);
  }

  public anexarDocumentoFormulario(instanceId: any, files: any, variavel: any): Observable<any> {

    const formData = new FormData();

    formData.append("name", variavel.name)
    formData.append("type", variavel.name)
    formData.append("valueInfo", variavel.valueInfo.filename)
    for (const key in files?.data) {
      const value = files.data[key];

      if (typeof value === 'string' && value.startsWith("files::")) {
        const file = files.files.get(value);
        if (file) {
          formData.append('file', file[0]);
        }
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    }

    return this.http.post<any>(`${environment.urlApi}/processo/api/upload/v1/process-instance/${instanceId}/variables/${variavel.name}`, formData);
  }
}
