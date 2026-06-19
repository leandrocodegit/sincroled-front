
export enum TipoIncidente {
  failedExternalTask = 'failedExternalTask',
  failedJob = 'failedJob'
}

export const TipoIncidenteDescriptions: Record<TipoIncidente, string> = {
  [TipoIncidente.failedExternalTask]: 'Falha de execução tarefa automática',
  [TipoIncidente.failedJob]: 'Falha no Job',
}
