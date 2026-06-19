export interface AssinaturaRequest {
  documentoId: String,
  sessionId?: string;
  token?: string;
  rubrica?: string;
  otpCode?: number;
  task?: string;
  processInstanceId?: string;
  signatarios: SignatarioPosition[];
}

export interface SignatarioPosition {
  id: string;
  sub: string,
  pagina: number;
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  heightPercent: number;
  nomeSignatario: string;
  email: string;
  cpf: string;
  protocolo: string;
  sessaoKeycloak?: KeycloakSessaoDTO;
}

export interface KeycloakSessaoDTO {
  id: string;
  ipAddress: string;
  started: number;
  browser: string;
  os: string;
  osVersion: string;
  clients: ClienteSessaoDTO[];
}

export interface ClienteSessaoDTO {
  clientId: string;
  clientName: string;
  userConsentRequired: boolean;
  inUse: boolean;
  offlineAccess: boolean;
}
