import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DocumentoLocalResponse, DocumentoParaSignatarioResponse } from '../models/signatario.model';
import { AssinaturaRequest } from '../models/assinatura-request';

@Injectable({
  providedIn: 'root'
},
)
export class AssinaturaLocalService {


  constructor(
    private readonly http: HttpClient) { }

  public buscarDocumentoAssinatura(uuidDoc: string): Observable<DocumentoParaSignatarioResponse> {
    return this.http.get<DocumentoParaSignatarioResponse>(`${environment.urlApi}/assinatura/local/documentos/${uuidDoc}/signatario`);
  }

  public buscarDocumento(uuidDoc: string): Observable<DocumentoLocalResponse> {
    return this.http.get<DocumentoLocalResponse>(`${environment.urlApi}/assinatura/local/documentos/${uuidDoc}`);
  }

  public cancelarDocumento(uuidDoc: string, request: {comment: string}): Observable<DocumentoLocalResponse> {
    return this.http.post<DocumentoLocalResponse>(`${environment.urlApi}/assinatura/local/documentos/${uuidDoc}/cancelar`, request);
  }

  public listaDocumentos(protocolo: string, mostrarTodos: boolean = false): Observable<DocumentoLocalResponse[]> {
    return this.http.get<DocumentoLocalResponse[]>(`${environment.urlApi}/assinatura/local/documentos/${protocolo}/protocolo?mostrarTodos=${mostrarTodos}`);
  }

  public listaDocumentosAssinar(documentosId: string[]): Observable<DocumentoParaSignatarioResponse[]> {
    return this.http.post<DocumentoParaSignatarioResponse[]>(`${environment.urlApi}/assinatura/local/lista/documentos`, documentosId[0]);
  }

  public listaDocumentosEnvelopeAssinar(envelope: string): Observable<DocumentoParaSignatarioResponse[]> {
    return this.http.get<DocumentoParaSignatarioResponse[]>(`${environment.urlApi}/assinatura/local/lista/documentos/${envelope}`);
  }

  public assinarDocumento(request: AssinaturaRequest): Observable<{ assinaturas: any[], documento: DocumentoParaSignatarioResponse }> {
    return this.http.post<{ assinaturas: any[], documento: DocumentoParaSignatarioResponse }>(`${environment.urlApi}/assinatura/local/assinar/documento`, request);
  }


}
