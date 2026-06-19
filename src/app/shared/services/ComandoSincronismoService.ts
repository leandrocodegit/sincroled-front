import { Injectable, NgZone } from '@angular/core';
import { MessageService } from 'primeng/api';
import { mergeMap, Observable, switchMap } from 'rxjs';
import { Tipoconfiguracao } from '../sincroled/models/constantes/tipo-configuracao';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
import { AuthService } from '@/core/auth/services/auth.service';
import { DispositivoService } from '../sincroled/services/dispositivo.service';

// Espelho do enum Java TipoResposta
export type TipoResposta = 'SUCESSO' | 'ERROR' | 'WARN' | 'OK';

export type SincronismoStatus =
  | 'AGUARDANDO'   // estado inicial
  | 'ENVIANDO'     // comando enviado, aguardando qualquer resposta
  | 'OK'           // device recebeu o comando — aguardando confirmação final
  | 'SUCESSO'      // device processou com sucesso — fim do fluxo
  | 'WARN'         // device processou com advertência — fim do fluxo
  | 'ERROR'        // erro no device ou no servidor — fim do fluxo
  | 'TIMEOUT';     // device não respondeu a tempo — fim do fluxo

// Payload JSON emitido pelo backend
export interface RespostaBackend {
  tipoResposta: TipoResposta;
  mensagem: string;
  deviceId: string;
}

export interface SincronismoEvento {
  status: SincronismoStatus;
  mensagem: string;
  deviceId: string;
  timestamp: Date;
  payload?: RespostaBackend;
  toast?: any
}

/** Texto emitido pelo Spring quando o Mono faz timeout sem resposta do device */
const MENSAGEM_FALHA = 'Falha, não houve resposta';

function isFalha(texto: string): boolean {
  const lower = texto.toLowerCase();
  return lower.includes('falha') || lower.includes('não houve resposta');
}

/**
 * Regras de encerramento do stream por TipoResposta:
 *
 *  OK      → intermediário: device recebeu, stream CONTINUA aberto
 *  SUCESSO → device confirmou processamento: complete()
 *  WARN    → device processou com advertência: complete()
 *  ERROR   → erro no device/servidor: error()
 */
function resolveStream(
  tipo: TipoResposta,
  evento: SincronismoEvento,
  eventSource: EventSource,
  observer: { next: (e: SincronismoEvento) => void; complete: () => void; error: (e: unknown) => void }
): void {
  observer.next(evento);

  switch (tipo) {
    case 'OK':
      // Intermediário — mantém stream aberto, apenas notifica
      break;
    case 'SUCESSO':
    case 'WARN':
      eventSource.close();
      observer.complete();
      break;
    case 'ERROR':
      eventSource.close();
      observer.error(evento);
      break;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ComandoSincronismoService {

  constructor(
    private dispositivoService: DispositivoService,
    private ouathService: OAuthService,
    private ngZone: NgZone) { }

  enviarComando(deviceId: string, tipoConfiguracao?: Tipoconfiguracao): Observable<SincronismoEvento> {
    return this.dispositivoService.buscarDispositivo(deviceId).pipe(
      switchMap((dispositivo) => {
        return this.sincronizar(deviceId, tipoConfiguracao);
      })
    );
  }

  sincronizar(deviceId: string, tipoConfiguracao?: Tipoconfiguracao): Observable<SincronismoEvento> {

    const url = `${environment.urlApi}/comando/sincronismo/${deviceId}?tipoConfiguracao=${tipoConfiguracao ?? Tipoconfiguracao.LED}`;

    return new Observable<SincronismoEvento>((observer) => {
      const eventSource = new EventSource(url + `&realm=${environment.authConfig.clientId}&access_token=${this.ouathService.getAccessToken()}`);

      eventSource.onmessage = (event) => {
        this.ngZone.run(() => {
          const raw: string = event.data ?? '';

          try {
            const body: RespostaBackend = JSON.parse(raw);

            let severity = 'success';

            if (body.tipoResposta == 'OK')
              severity = 'info';
            else if (body.tipoResposta == 'WARN')
              severity = 'warn';
            else if (body.tipoResposta == 'ERROR')
              severity = 'error';

            const evento: SincronismoEvento = {
              status: body.tipoResposta as SincronismoStatus,
              mensagem: body.mensagem,
              deviceId: body.deviceId ?? deviceId,
              timestamp: new Date(),
              payload: body,
              toast: { severity: severity, detail: body.mensagem }
            };

            resolveStream(body.tipoResposta, evento, eventSource, observer);

          } catch {
            // Texto simples — verifica se é a mensagem de timeout do backend
            if (isFalha(raw)) {
              const evento: SincronismoEvento = {
                status: 'TIMEOUT',
                mensagem: MENSAGEM_FALHA,
                deviceId,
                timestamp: new Date(),
                toast: { severity: 'error', detail: MENSAGEM_FALHA }
              };
              eventSource.close();
              observer.next(evento);
              observer.error(evento);

            } else {
              // Texto inesperado — trata como SUCESSO e encerra
              observer.next({
                status: 'SUCESSO',
                mensagem: raw,
                deviceId,
                timestamp: new Date(),
                toast: { severity: 'warn', detail: raw }
              });
              eventSource.close();
              observer.complete();
            }
          }
        });
      };

      // Erro de transporte (rede, CORS, servidor indisponível)
      eventSource.onerror = () => {
        this.ngZone.run(() => {
          eventSource.close();
          observer.error({
            status: 'ERROR',
            mensagem: 'Falha na conexão com o servidor',
            deviceId,
            timestamp: new Date(),
            toast: { severity: 'error', detail: 'Falha na conexão com o servidor' }
          } as SincronismoEvento);
        });
      };

      return () => eventSource.close();
    });
  }

  enviarDebug(deviceId: string, tipoConfiguracao?: Tipoconfiguracao): Observable<any> {
    return this.dispositivoService.buscarDispositivo(deviceId).pipe(
      // mergeMap não mata o fluxo interno quando o HTTP original completa
      mergeMap((dispositivo) => {
        return this.debugar(deviceId, tipoConfiguracao);
      })
    );
  }

  debugar(deviceId: string, tipoConfiguracao?: Tipoconfiguracao): Observable<SincronismoEvento> {

    const url = `${environment.urlApi}/comando/debug/${deviceId}?tipoConfiguracao=${tipoConfiguracao ?? Tipoconfiguracao.LED}`;

    return new Observable<SincronismoEvento>((observer) => {
      const eventSource = new EventSource(url + `&realm=${environment.authConfig.clientId}&access_token=${this.ouathService.getAccessToken()}`);

      eventSource.onmessage = (event) => {
        this.ngZone.run(() => {
          const raw: string = event.data ?? '';

          try {
            const body: RespostaBackend = JSON.parse(raw);

            let severity = 'success';

            if (body.tipoResposta == 'OK')
              severity = 'info';
            else if (body.tipoResposta == 'WARN')
              severity = 'warn';
            else if (body.tipoResposta == 'ERROR')
              severity = 'error';

            const evento: SincronismoEvento = {
              status: body.tipoResposta as SincronismoStatus,
              mensagem: body.mensagem,
              deviceId: body.deviceId ?? deviceId,
              timestamp: new Date(),
              payload: body,
              toast: { severity: severity, detail: body.mensagem }
            };

            // resolveStream(body.tipoResposta, evento, eventSource, observer);
            observer.next(evento);

          } catch {
            // Texto simples — verifica se é a mensagem de timeout do backend
            if (isFalha(raw)) {
              const evento: SincronismoEvento = {
                status: 'TIMEOUT',
                mensagem: MENSAGEM_FALHA,
                deviceId,
                timestamp: new Date(),
                toast: { severity: 'error', detail: MENSAGEM_FALHA }
              };
              //   eventSource.close();
              //  observer.next(evento);
              //  observer.error(evento);

            } else {
              // Texto inesperado — trata como SUCESSO e encerra
              observer.next({
                status: 'SUCESSO',
                mensagem: raw,
                deviceId,
                timestamp: new Date(),
                toast: { severity: 'warn', detail: raw }
              });
              //  eventSource.close();
              //  observer.complete();
            }
          }
        });
      };

      // Erro de transporte (rede, CORS, servidor indisponível)
      eventSource.onerror = () => {
        this.ngZone.run(() => {
          //    eventSource.close();
          observer.error({
            status: 'ERROR',
            mensagem: 'Falha na conexão com o servidor',
            deviceId,
            timestamp: new Date(),
            toast: { severity: 'error', detail: 'Falha na conexão com o servidor' }
          } as SincronismoEvento);
        });
      };

      return () => eventSource.close();
    });
  }

  enviarCor(corId: string, deviceId: string, cancelar: boolean, tipoConfiguracao?: Tipoconfiguracao): Observable<SincronismoEvento> {
    return this.dispositivoService.buscarDispositivo(deviceId).pipe(
      switchMap((dispositivo) => {
        return this.temporizar(corId, deviceId, cancelar, tipoConfiguracao);
      })
    );
  }

  temporizar(corId: string, deviceId: string, cancelar: boolean, tipoConfiguracao?: Tipoconfiguracao): Observable<SincronismoEvento> {

    let url = `${environment.urlApi}/comando/flux/temporizar/${corId}/${deviceId}?tipoConfiguracao=${tipoConfiguracao ?? Tipoconfiguracao.LED}`;

    if(cancelar)
      url = `${environment.urlApi}/comando/flux/temporizar/cancelar/${deviceId}?tipoConfiguracao=${tipoConfiguracao ?? Tipoconfiguracao.LED}`;

    return new Observable<SincronismoEvento>((observer) => {
      const eventSource = new EventSource(url + `&realm=${environment.authConfig.clientId}&access_token=${this.ouathService.getAccessToken()}`);

      eventSource.onmessage = (event) => {
        this.ngZone.run(() => {
          const raw: string = event.data ?? '';

          try {

            const body: RespostaBackend = JSON.parse(raw);

            let severity = 'success';

            if (body.tipoResposta == 'OK')
              severity = 'info';
            else if (body.tipoResposta == 'WARN')
              severity = 'warn';
            else if (body.tipoResposta == 'ERROR')
              severity = 'error';

            const evento: SincronismoEvento = {
              status: body.tipoResposta as SincronismoStatus,
              mensagem: body.mensagem,
              deviceId: body.deviceId ?? deviceId,
              timestamp: new Date(),
              payload: body,
              toast: { severity: severity, detail: body.mensagem }
            };

            resolveStream(body.tipoResposta, evento, eventSource, observer);

          } catch {
            // Texto simples — verifica se é a mensagem de timeout do backend
            if (isFalha(raw)) {
              const evento: SincronismoEvento = {
                status: 'TIMEOUT',
                mensagem: MENSAGEM_FALHA,
                deviceId,
                timestamp: new Date(),
                toast: { severity: 'error', detail: MENSAGEM_FALHA }
              };
              eventSource.close();
              observer.next(evento);
              observer.error(evento);

            } else {
              // Texto inesperado — trata como SUCESSO e encerra
              observer.next({
                status: 'SUCESSO',
                mensagem: raw,
                deviceId,
                timestamp: new Date(),
                toast: { severity: 'warn', detail: raw }
              });
              eventSource.close();
              observer.complete();
            }
          }
        });
      };

      // Erro de transporte (rede, CORS, servidor indisponível)
      eventSource.onerror = () => {
        this.ngZone.run(() => {
          eventSource.close();
          observer.error({
            status: 'ERROR',
            mensagem: 'Falha na conexão com o servidor',
            deviceId,
            timestamp: new Date(),
            toast: { severity: 'error', detail: 'Falha na conexão com o servidor' }
          } as SincronismoEvento);
        });
      };

      return () => eventSource.close();
    });
  }
}
