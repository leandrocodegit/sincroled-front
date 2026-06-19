import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from 'src/app/shared/models/Page';
import { Servico } from '../models/servico.model';
import { formatarData } from './util/DateUtil';
import { gerarDataForm } from './util/formularioUtil';


@Injectable({
  providedIn: 'root'
},
)
export class ProtocoloService {

  public isDownload = false;

  constructor(
    private readonly http: HttpClient) { }

  public buscarProtocolo(protocolo: any): Observable<any> {
    return this.http.get<Page<any>>(`${environment.urlApi}/protocolos/protocolo/${protocolo}`);
  }

  public listarProtocolos(sort?: any): Observable<Page<any>> {
    return this.http.get<Page<any>>(`${environment.urlApi}/protocolos/protocolo?${sort ?? ''}`);
  }

  public gerarProtocolo(servico: any): Observable<any> {
    return this.http.post<Page<any>>(`${environment.urlApi}/protocolos/protocolo`, servico);
  }

  public gerarProtocoloFormulario(servicoId: any, data: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/protocolos/protocolo/form/${servicoId}`, gerarDataForm(data));
  }

  public restartProtocolo(request: any): Observable<any> {
    return this.http.post<Page<any>>(`${environment.urlApi}/protocolos/protocolo/restart`, request);
  }

  public buscarConfiguracoesDeProtocolo(configuracaoProtocoloId: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/protocolos/configuracao-protocolo/${configuracaoProtocoloId}`);
  }

  public listarConfiguracoesDeProtocolos(): Observable<any[]> {
    return this.http.get<any>(`${environment.urlApi}/protocolos/configuracao-protocolo`);
  }

  public criarConfiguracoesDeProtocolo(configuracoesDeProtocolo: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/protocolos/configuracao-protocolo`, configuracoesDeProtocolo);
  }

  public removerConfiguracoesDeProtocolo(protocoloId: any): Observable<any> {
    return this.http.delete<any>(`${environment.urlApi}/protocolos/configuracao-protocolo/${protocoloId}`);
  }

  public downloadProtocolo(protocolo: any): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/protocolos/protocolo/download/${protocolo}`, { responseType: 'blob' as 'json' });
  }

    public listarTarefasDelegadas(protocolo: string): Observable<Page<any>> {
    return this.http.get<Page<any>>(`${environment.urlApi}/protocolos/protocolo/task/${protocolo}`);
  }
}
