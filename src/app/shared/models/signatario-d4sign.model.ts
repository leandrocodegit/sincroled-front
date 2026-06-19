export class SignatarioModelD4sign {
  signers: SignatarioD4sign[];

  constructor(data?: Partial<SignatarioModelD4sign>) {
    this.signers = data.signers ?? [];
  }
}

export class SignatarioD4sign {
  id: string;
  key_signer: string;
  email: string;
  act: string;
  foreign: boolean;
  certificadoicpbr: boolean;
  desenharRubrica: boolean;
  posicaoLivre: boolean;
  assinatura_presencial: boolean;
  docauth: boolean;
  docauthandselfie: boolean;
  embed_methodauth: string;
  embed_smsnumber: string;
  upload_allow: boolean;
  upload_obs: string;

  // Opcionais
  whatsapp_number?: string;
  uuid_grupo?: string;
  user_name?: string;

  certificadoicpbr_tipo?: string;
  certificadoicpbr_cpf?: string;
  certificadoicpbr_cnpj?: string;

  password_code?: string;

  auth_pix?: boolean;
  auth_pix_nome?: string;
  auth_pix_cpf?: string;

  videoselfie?: string;

  d4sign_score?: boolean;
  d4sign_score_nome?: string;
  d4sign_score_cpf?: string;
  d4sign_score_similarity?: number;
  color?: string;

  skipemail?: string;
  display_name?: string;
  documentation?: string;
  birthday?: string;

  constructor(data: Partial<SignatarioD4sign> = {}) {
    this.id = data.id;
    this.key_signer = data.key_signer ?? '';
    this.email = data.email ?? '';
    this.act = data.act ?? '1';
    this.foreign = data.foreign ?? false;
    this.certificadoicpbr = data.certificadoicpbr ?? false;
    this.desenharRubrica = data.desenharRubrica ?? false;
    this.posicaoLivre = data.posicaoLivre ?? false;
    this.assinatura_presencial = data.assinatura_presencial ?? false;
    this.docauth = data.docauth ?? false;
    this.docauthandselfie = data.docauthandselfie ?? false;
    this.embed_methodauth = data.embed_methodauth ?? 'email';
    this.embed_smsnumber = data.embed_smsnumber ?? '';
    this.upload_allow = data.upload_allow ?? false;
    this.upload_obs = data.upload_obs ?? '';
    this.user_name = data.user_name ?? '';
    this.color = data.color ?? '';

    this.whatsapp_number = data.whatsapp_number ?? '';
    this.uuid_grupo = data.uuid_grupo ?? '';

    this.certificadoicpbr_tipo = data.certificadoicpbr_tipo ?? '';
    this.certificadoicpbr_cpf = data.certificadoicpbr_cpf ?? '';
    this.certificadoicpbr_cnpj = data.certificadoicpbr_cnpj ?? '';

    this.password_code = data.password_code ?? '';

    this.auth_pix = data.auth_pix ?? false;
    this.auth_pix_nome = data.auth_pix_nome ?? '';
    this.auth_pix_cpf = data.auth_pix_cpf ?? '';

    this.videoselfie = data.videoselfie;

    this.d4sign_score = data.d4sign_score ?? false;
    this.d4sign_score_nome = data.d4sign_score_nome ?? '';
    this.d4sign_score_cpf = data.d4sign_score_cpf ?? '';
    this.d4sign_score_similarity = data.d4sign_score_similarity ?? 90;

    this.skipemail = data.skipemail ?? '';
  }
}

