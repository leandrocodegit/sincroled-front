import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginaServico } from '../models/pagina-servico.model';
import { PinsRequest } from '../models/pins-request.models';
import { SignatarioD4sign, SignatarioModelD4sign } from '../models/signatario-d4sign.model';
import { DocumentD4sign } from '../models/document-d4sign.model';
import { DocumentD4signSend } from '../models/document-d4sign-send.model';
import { AssinaturaRequest } from '../models/assinatura-request';
import { DocumentoParaSignatarioResponse } from '../models/signatario.model';

@Injectable({
  providedIn: 'root'
},
)
export class AssinaturaService {


  constructor(
    private readonly http: HttpClient) { }

  public listaCofres(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/assinatura/cofre?page=1`);
  }

  public buscarCofre(cofreId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/assinatura/cofre/${cofreId}?page=1`);
  }

  public listaPastasCofre(cofreId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/assinatura/cofre/folder/${cofreId}`);
  }

  public criarPasta(folder: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/assinatura/cofre/folder/create`, folder);
  }

  public listaDocumentosCofre(cofreId: string): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/assinatura/cofre/documentos/${cofreId}?page=1`);
  }

  public listaDocumentosPasta(cofreId: string, folderId: string): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/assinatura/cofre/documentos/${cofreId}/${folderId}?page=1`);
  }

  public listaDocumentosStatus(status: number): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/assinatura/documento/status/${status}?page=1`);
  }

  public listaDocumentosAnexos(uuidDoc: string): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/assinatura/documento/anexos/${uuidDoc}?page=1`);
  }

  public downloadDocumento(uuidDoc: string): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/assinatura/documento/download/base64/${uuidDoc}`);
  }

  public downloadDocumentoBinario(uuidDoc: string): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/assinatura/documento/download/${uuidDoc}`, { responseType: 'blob' as 'json' });
  }

  public posicionarAssinatura(uuidDoc: string, request: PinsRequest): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/assinatura/signatario/posicao/${uuidDoc}`, request);
  }

  public adicionarSignatario(uuidDoc: string, request: SignatarioD4sign): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/assinatura/signatario/criar/${uuidDoc}`, { signers: [request] });
  }

  public removerSignatario(uuidDoc: string, request: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/assinatura/signatario/remover/${uuidDoc}`, request);
  }

  public reenviarEmail(uuidDoc: string, request: { "email": string, "key_signer": string }): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/assinatura/signatario/resend/${uuidDoc}`, request);
  }

  public listarPosicaoAssinatura(uuidDoc: string): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/assinatura/signatario/posicao/${uuidDoc}`);
  }

  public listarObservadores(uuidDoc: string): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/assinatura/observadores/${uuidDoc}`);
  }

  public adicionarObservador(uuidDoc: string, request: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/assinatura/observadores/adicionar/${uuidDoc}`, request);
  }

  public removerObservador(uuidDoc: string, request: any): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/assinatura/observadores/remover/${uuidDoc}`, request);
  }

  public removerTodosObservadores(uuidDoc: string): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/assinatura/observadores/remover-todos/${uuidDoc}`, {});
  }

  public enviarParaAssinatura(uuidDoc: string, request: DocumentD4signSend): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/assinatura/signatario/send/${uuidDoc}`, request);
  }


  public uploadDocumento(filePrincipal: any, anexos: any[], cofreId: string): Observable<any> {

    const formData = new FormData();
    formData.append('principal', filePrincipal);
    if (anexos.length)
      anexos.forEach(file => {
        formData.append('anexos', file);
      });

    return this.http.post<any>(`${environment.urlApi}/assinatura/documento/upload/${cofreId}`, formData);
  }

  public uploadAnexos(anexos: any[], uuidDoc: string): Observable<any> {

    const formData = new FormData();
    if (anexos)
      anexos.forEach(file => {
        formData.append('anexos', file);
      });

    return this.http.post<any>(`${environment.urlApi}/assinatura/documento/upload/anexo/${uuidDoc}`, formData);
  }

  public listaSignatarios(uuidDoc: string): Observable<DocumentD4sign> {
    return this.http.get<DocumentD4sign>(`${environment.urlApi}/assinatura/signatario/${uuidDoc}`);
  }

  public extrairSignatarios(idDocumento: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}/assinatura/local/extrair/${idDocumento}/signatarios`);
  }

  public validarAssinatura(idDocumento: string): Observable<any> {
    return this.http.get<any[]>(`${environment.urlApi}/assinatura/local/validar/${idDocumento}/assinatura`);
  }
}
