import { HttpHeaders } from "@angular/common/http";

const protocolo = 'https://';
const host = 'dev.simodapp.com';
const porta = ":2053"
export const environment = {
  url: protocolo + host + porta,
  debug: protocolo + host + ':4200/debug/',
  production: false,
  portal: true,
  router: 'portal',
  urlApi: protocolo + host + porta,
  urlbroker: 'https://painel.sincroled.com.br:9000/comando',
  urlWebSocket: 'painel.sincroled.com.br',
  timeout: 100000,
  sitekey: '1x00000000000000000000AA',
  authConfig: {
    issuer: `https://auth.simodapp.com:8443/realms/simod`,
    redirectUri: window.location.origin + '/auth',
    postLogoutRedirectUri: window.location.origin,
    clientId: 'simod',
    responseType: 'code',
    scope: `openid profile email`,
    showDebugInformation: false,
    strictDiscoveryDocumentValidation: false,
   // timeoutFactor: 0.20,
   // sessionChecksEnabled: false,
    //silentRefreshRedirectUri: window.location.origin + '/assets/silent-refresh.html',
  //  useSilentRefresh: false,
    decreaseExpirationBySec: 10000,
    clockSkewInSec: 0,
    requireHttps: false
  },
  headers: {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  },
};
