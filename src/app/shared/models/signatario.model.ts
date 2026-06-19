
export interface Signatario {
  id: string,
  ordem: number,
  nome: string;
  email: string;
}

export interface DocumentoParaSignatarioResponse {
  documentoId: string;
  nome: string;
  originalKey: string;
  docKey: string;
  statusAssinatura: StatusAssinatura;
  statusDocumento: StatusDocumento;
  originalHost: string;
  docHost: string;
  externalId: string;
  email: string;

  // Dados do signatário autenticado dentro deste documento
  signatarioId: string;
  desenharRubrica: boolean;
  posicaoLivre: boolean;
  tipoIntegracao: TipoIntegracao;
  posicoes: PosicaoResponse[];
}

export interface PosicaoResponse {
  id: string;
  pagina: number;
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  heightPercent: number;
  pageWith: number;
  pageHeigth: number;
  ordem: number;
}

export interface DocumentoLocalResponse {
  id: string; // UUID mapeia para string
  nome: string;
  originalKey: string;
  docKey: string;
  originalHost: string; // URL mapeia para string
  docHost: string;
  thumbail: string;
  tenant: string;
  status: StatusDocumento;
  tipoIntegracao: TipoIntegracao;
  externalId: string;
  protocolo: string;
  processInstanceId: string;
  latest?: DocumentoVersaoResponse; // Opcional caso não tenha versão ainda
  signatarios: SignatarioLocalResponse[];
}

export interface DocumentoVersaoResponse {
  s3VersionId: string;
  s3Key: string;
  s3Bucket: string;
  eTag: string;
  status: StatusDocumento;
  dataVersao: string; // LocalDateTime mapeia para string (ISO 8601)
  tenant: string;
  numeroVersao: number;
  hashConteudo: string;
}

export interface SignatarioLocalResponse {
  id: string;
  userId: string;
  nome: string;
  email: string;
  cpf: string;
  protocolo: string;
  desenharRubrica: boolean;
  posicaoLivre: boolean;
}

// Sugestão de Enums baseados no contexto do SIMOD
export type StatusAssinatura = 'PENDENTE' | 'ASSINADO' | 'REJEITADO';
export type StatusDocumento = 'PENDENTE' | 'CONCLUIDO' | 'CANCELADO' | 'FINALIZADO';
export type TipoIntegracao = 'LOCAL' | 'D4SIGN'