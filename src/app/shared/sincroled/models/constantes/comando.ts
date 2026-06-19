export enum Comando {
    ENVIAR = 'ENVIAR',
    ENVIADO = 'ENVIADO',
    ACEITO = 'ACEITO',
    SISTEMA = 'SISTEMA',
    NENHUM_DEVICE = 'NENHUM_DEVICE',
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
    SINCRONIZAR = 'SINCRONIZAR',
    TESTE = 'TESTE',
    CONCLUIDO = 'CONCLUIDO',
    TIMER_CRIADO = 'TIMER_CRIADO',
    OCORRENCIA = 'OCORRENCIA',
    VIBRACAO = 'VIBRACAO',
    AGENDA_EXECUTADA = 'AGENDA_EXECUTADA'
}

export const ComandoValue: Record<Comando, string> = {
  [Comando.ENVIAR]: 'Pendente',
  [Comando.ENVIADO]: 'Enviado',
  [Comando.ACEITO]: 'Aceito',
  [Comando.SISTEMA]: 'Sistema',
  [Comando.NENHUM_DEVICE]: 'Desconhecido',
  [Comando.ONLINE]: 'Online',
  [Comando.OFFLINE]: 'Offline',
  [Comando.SINCRONIZAR]: 'Sincronizar',
  [Comando.TESTE]: 'Teste',
  [Comando.CONCLUIDO]: 'Teste concluido',
  [Comando.OCORRENCIA]: 'Ocorrência detectada',
  [Comando.TIMER_CRIADO]: 'Criado Temporizador',
  [Comando.VIBRACAO]: 'Impacto Detectado',
  [Comando.AGENDA_EXECUTADA]: 'Agenda Executada',
};
