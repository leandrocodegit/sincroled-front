import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PageEvent } from '@angular/material/paginator';
import { Page } from '../../models/Page';
import { Sort } from '@angular/material/sort';
import { Dispositivo } from '../models/dispositivo.model';
import { Cor } from '../models/cor.model';
import { Filtro } from '../models/constantes/filtro';



@Injectable({
  providedIn: 'root'
},
)
export class DispositivoService {

  public deviceEdit!: Dispositivo;
  public corEdit!: Cor;
  public ajutarPadding = new EventEmitter;
  public mapaEdit = new EventEmitter;
  public pesquisa = new EventEmitter;
  public tabSelect = new EventEmitter;
  public selectDispositivo = new EventEmitter;

  constructor(
    private readonly http: HttpClient) { }

  public alterarNomeDicpositivo(dispositivo: Dispositivo): Observable<any> {
    return this.http.patch<any>(`${environment.urlApi}/device`, dispositivo, environment.headers)
  }

  public alterarClienteDicpositivo(dispositivo: Dispositivo): Observable<any> {
    return this.http.patch<any>(`${environment.urlApi}/device/cliente`, dispositivo, environment.headers)
  }

  public ativar(dispositivoId: string): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/device/ativar/${dispositivoId}`)
  }

  public salvarConfiguracao(dispositivo: Dispositivo): Observable<any> {
    return this.http.patch<any>(`${environment.urlApi}/device/configuracao`, {
      id: dispositivo.id,
      sensibilidadeVibracao: dispositivo.sensibilidadeVibracao,
      conexao: dispositivo.conexao,
      corVibracao: dispositivo?.operacao?.corVibracao?.id,
      corBotao: dispositivo?.operacao?.corBotao?.id,
      btHabilitado: dispositivo.conexao.btHabilitado,
      vbHabilitado: dispositivo.conexao.vbHabilitado,
      tempoEvento: dispositivo.tempoEvento
    })
  }

  public salvarConfiguracaoWifi(deviceId: string, wifi: any): Observable<any> {
    return this.http.patch<any>(`${environment.urlApi}/device/configuracao/wifi/${deviceId}`, wifi)
  }

  public pesquisarDispositivo(pesquisa: string, page?: PageEvent): Observable<Page<Dispositivo>> {
    return this.http.get<Page<Dispositivo>>(`${environment.urlApi}/device/pesquisar/${pesquisa}?page=${page?.pageIndex}&size=${page?.pageSize}`, environment.headers)
  }

  public buscarDispositivo(id: string): Observable<Dispositivo> {
    return this.http.get<Dispositivo>(`${environment.urlApi}/device/${id}`)
  }

  public listaTodosDispositivos(noLoad?: boolean, page?: PageEvent): Observable<Page<Dispositivo>> {
    return this.http.get<Page<Dispositivo>>(`${environment.urlApi}/device?page=${page?.pageIndex ?? 0}&size=${page?.pageSize ?? 20}&noLoad=${noLoad ?? false}`)
  }

  public listaTodosDispositivosFiltro(filtro: Filtro, sort?: Sort, page?: PageEvent): Observable<Page<Dispositivo>> {
    if (!sort) {
      sort = {
        active: 'nome',
        direction: 'asc'
      }
    }
    return this.http.get<Page<Dispositivo>>(`${environment.urlApi}/device/filtro/${filtro}?page=${page?.pageIndex}&size=${page?.pageSize}&sort=${sort?.active},${sort?.direction}`, environment.headers)
  }

  public listaTodosDispositivosFiltroNaoPaginado(filtro: Filtro): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(`${environment.urlApi}/device/filtro/${filtro}?unpaged=${true}`, environment.headers)
  }

  public mudarStatus(id: number): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/device/ativar/${id}`, environment.headers)
  }

  public sincronizar(ids: number[], teste: boolean): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/comando/sincronizar/${teste}`, ids, environment.headers)
  }

  public sincronizarTudo(): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/comando/sincronizar/false`, environment.headers)
  }

  public enviarComandoTemporizado(idCor: string, id: number, cancelar: boolean): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/cor/temporizar`, {
      idCor: idCor,
      id: id,
      cancelar: cancelar
    }, environment.headers)
  }

  public formatCor(cores: number[], tipoCor: string) {
    if (tipoCor == 'RBG') {
      return [
        cores[0],
        cores[2],
        cores[1],
        cores[3],
        cores[5],
        cores[4]
      ];
    } else if (tipoCor == 'GRB') {
      return [
        cores[2],
        cores[0],
        cores[1],
        cores[5],
        cores[3],
        cores[4]
      ];
    }
    return cores;
  }

  public formatCorrecao(correcao: number[], tipoCor: string) {
    if (tipoCor == 'RBG') {
      return [
        correcao[0],
        correcao[2],
        correcao[1]
      ];
    } else if (tipoCor == 'GRB') {
      return [
        correcao[2],
        correcao[0],
        correcao[1]
      ];
    }
    return correcao;
  }

  public uploadFirmware(id: string, file: File): Observable<any> {

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${environment.urlApi}/firmware/upload/${id}`, formData)
  }

    public updateFirmware(id: string): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/firmware/update/${id}`, {})
  }
}
