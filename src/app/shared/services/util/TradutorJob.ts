export function  traduzirJobType(jobType?: string): string {
    if (!jobType) return 'Desconhecido';

    const map: Record<string, string> = {
      // Async / continuação
      'async-continuation': 'Continuação assíncrona',

      // Timers
      'timer-transition': 'Timer (transição)',
      'timer-intermediate-transition': 'Timer (evento intermediário)',
      'timer-start-event': 'Timer (início do processo)',
      'timer-start-event-subprocess': 'Timer (início de subprocesso)',

      // Event job
      'event': 'Evento',

      // Batch (jobs do mecanismo de batch)
      'batch-seed-job': 'Lote (criação de jobs)',
      'batch-monitor-job': 'Lote (monitoramento)',

      // Ativações / suspensões (administrativos)
      'activate-job-definition': 'Ativar definição de job',
      'suspend-job-definition': 'Suspender definição de job',
      'activate-processdefinition': 'Ativar definição de processo',
      'suspend-processdefinition': 'Suspender definição de processo',
      'set-job-retries': 'Alteração de retentativa',
      'instance-modification': 'Alteração de instância',
      'instance-update-suspension-state': 'Alteração Estado de Suspenção'
    };
    return map[jobType] ?? jobType;
}