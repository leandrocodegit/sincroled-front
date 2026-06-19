import { HttpClient, HttpContext, HttpEventType, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { __await } from 'tslib';
import { Observable } from 'rxjs';
import { AuthService } from '@/core/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { Tipoconfiguracao } from '../models/constantes/tipo-configuracao';
import { Dispositivo } from '../models/dispositivo.model';




@Injectable({
  providedIn: 'root'
},
)
export class ComandoService {

  public temporizadorEmit = new EventEmitter;
  public testeEmit = new EventEmitter

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) { }

  public criarTemporizador(idCor: string, id: number): Observable<any> {
    return this.http.get<any>(`${environment.urlbroker}/temporizar/${idCor}/${id}`)
  }

  public sincronizarDispositivo(id: string, tipo: Tipoconfiguracao): Observable<any> {

    return new Observable<any>(obs => {
      const eventSource = new EventSource(`${environment.urlbroker}/${id}/${tipo}`, {
        withCredentials: false,
      });

      eventSource.addEventListener('message', (evt: any) => {
        this.temporizadorEmit.emit(evt.data);
      });

      eventSource.addEventListener('error', (err) => {
        eventSource.close();
        obs.complete();
      });

      return () => {
        eventSource.close();
      };
    })
  }

  public sincronizar(responder: boolean, logs: any[]): Observable<any> {

    return new Observable<any>(obs => {
      const eventSource = new EventSource(`${environment.urlbroker}/sincronizar/${responder}`, {
        withCredentials: false
      });

      eventSource.addEventListener('message', (evt: any) => {
        const falha = evt.data.includes('não') || evt.data.toUpperCase().includes('FALHA');
        const naoEncontrado = evt.data.includes('não encontrado');
        if(evt.data.includes('offline'))
          logs.push({ severity: 'danger', status: 'Offline', detail: evt.data, tipo: 'Não enviado' });
       else logs.push({ severity: falha ? (naoEncontrado ? 'warn' : 'danger') : 'success', status: falha ? 'Falha' : 'Concluido', detail: evt.data, tipo: falha ? (naoEncontrado ? 'Não enviado' : 'Sem resposta') : 'Ok' });
      });

      eventSource.addEventListener('error', (err) => {
        eventSource.close();
        obs.complete();
      });

      return () => {
        eventSource.close();
      };
    })
  }

  public enviarComandoRapido(idCor: string, id: number): Observable<any> {

    return new Observable<any>(obs => {
      const eventSource = new EventSource(`${environment.urlbroker}/flux/temporizar/${idCor}/${id}`, {
        withCredentials: false
      });

      eventSource.addEventListener('message', (evt: any) => {
        this.temporizadorEmit.emit(evt.data);
      });

      eventSource.addEventListener('error', (err) => {
        eventSource.close();
        obs.complete();
      });

      return () => {
        eventSource.close();
        this.temporizadorEmit.emit('close');
      };
    })
  }

  public cancelarComandoRapido(id: number): Observable<any> {

    return new Observable<any>(obs => {
      const eventSource = new EventSource(`${environment.urlbroker}/flux/temporizar/${id}`, {
        withCredentials: false
      });

      eventSource.addEventListener('message', (evt: any) => {
        this.temporizadorEmit.emit(evt.data);
      });

      eventSource.addEventListener('error', (err) => {
        eventSource.close();
        obs.complete();
      });

      return () => {
        eventSource.close();
      };
    })
  }

  public sincronizarTudo(): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/comando/sincronizar/false`, environment.headers)
  }

  public enviarComandoTemporizado(idCor: string, id: number, cancelar: boolean): Observable<any> {
    return this.http.post<any>(`${environment.urlApi}/cor/temporizar`, {
      idCor: idCor,
      id: id,
      cancelar: cancelar
    })
  }

  public testar(id: number): Observable<any> {
    return new Observable<any>(obs => {
      const eventSource = new EventSource(`${environment.urlbroker}/teste/${id}`, {
        withCredentials: false
      });

      eventSource.addEventListener('message', (evt: any) => {
        this.testeEmit.emit(evt.data);
      });

      eventSource.addEventListener('error', (err) => {
        eventSource.close();
        obs.complete();
      });

      return () => {
        eventSource.close();
      };
    })
  }

  public uploadFirmware(id: number, file: File): Observable<any> {

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${environment.url}/firmware/upload/${id}`, formData)
  }

  public sincronizarOff(dispositivo: Dispositivo): Observable<any> {
    return this.http.post<any>(`${environment.urlbroker}/sincronismo/${dispositivo.id}`, {
      id: dispositivo.id,
      cor: dispositivo.cor
    })
  }

  public updateFirmware(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url}/firmware/update/${id}`)
  }

/*   public updateFirmware(response: any): Observable<any> {
    return new Observable<any>(obs => {
      const eventSource = new EventSource(`${environment.urlbroker}/firmware/update/${response.id}`);

      eventSource.addEventListener('message', (evt: any) => {
        response.data = evt.data;
        if(evt.data.includes('Online')){
          this.testeEmit.emit(evt.data);
        }
      });

      eventSource.addEventListener('error', (err) => {
        eventSource.close();
        obs.complete();
      });

      return () => {
        eventSource.close();
      };
    })
  } */
}
