import { HttpParams } from "@angular/common/http";
import { formatarData, formatarDataTimeForm } from "./DateUtil";

export const FILTROS_TAREFAS_EXTERNAS = [
  {
    label: 'Ativas',
    key: 'active'
  },
  {
    label: 'Suspensas',
    key: 'suspended'
  },
  {
    label: 'Desbloqueadas',
    key: 'notLocked'
  },
  {
    label: 'Bloqueadas',
    key: 'locked'
  },
  {
    label: 'Com Tentativas',
    key: 'withRetriesLeft'
  },
  {
    label: 'Tentativas esgotadas',
    key: 'noRetriesLeft'
  }
];

export const FILTROS_HITORICO_JOB_LOGS = [
  {
    label: 'Criado',
    key: 'creationLog'
  },
  {
    label: 'Sucesso',
    key: 'successLog'
  },
  {
    label: 'Falha',
    key: 'failureLog'
  },
  {
    label: 'Removidos',
    key: 'deletionLog'
  }
];

export const FILTROS_LISTA_JOBS = [
  {
    label: 'Ativos',
    key: 'active'
  },
  {
    label: 'Suspensos',
    key: 'suspended'
  },
  {
    label: 'Com Falha',
    key: 'withException'
  },
  {
    label: 'Executável',
    key: 'executable'
  },
  {
    label: 'Com Tentativas',
    key: 'withRetriesLeft'
  },
  {
    label: 'Tentativas esgotadas',
    key: 'noRetriesLeft'
  }
];

export const FILTROS_DEFINICAO_JOBS = [
  {
    label: 'Ativos',
    key: 'active'
  },
  {
    label: 'Suspensos',
    key: 'suspended'
  },
  {
    label: 'Prioridade Sobrescrita',
    key: 'withOverridingJobPriority'
  }
]

export const FILTROS_PROCESS_DEFINITIONS = [
  {
    label: 'Ativos',
    key: 'active'
  },
  {
    label: 'Suspensos',
    key: 'suspended'
  }
]

export const FILTROS_INCIDENTES = [
  {
    label: 'Aberto',
    key: 'open'
  },
  {
    label: 'Removido',
    key: 'deleted'
  },
  {
    label: 'Resolvido',
    key: 'resolved'
  }
]

export const FILTRO_COUNT = [
  'jobId',
  'logId',
  'activityId',
  'externalTaskId',
  'processInstanceId',
  'jobDefinitionId',
  'processDefinitionKey',
  'processDefinitionId',
  'createTimes',
  'dueDates',
  'createTimeAfter',
  'createTimeBefore'
]

export function trasnformParams(filtro?: any) {

  if(!filtro) return '';

  const cleanObj = Object.entries(filtro).reduce((acc, [key, value]) => {
    acc[key] = value instanceof Date ? value.toISOString() : value;
    return acc;
  }, {} as any);

  const params = new HttpParams({ fromObject: cleanObj });
  return params.toString();
}

export function toCamundaQueryParamsDate(obj: any): string {
  let params = new HttpParams();

  for (const key in obj) {
    let value = obj[key];
    if (value === null || value === undefined || value === '') continue;

    if (key.endsWith('Times') || key.endsWith('Dates') || key.endsWith('Timestamp') || key.endsWith('TimeBefore') || key.endsWith('TimeAfter')) {
      if (value[0] && value[1])
        params = params.append(key, `gt_${formatarData(value[0])},lt_${formatarData(value[1])}`);
      else if (value[0])
        params = params.append(key, `gt_${formatarData(value[0])}`);
      else if (value[1])
        params = params.append(key, `lt_${formatarData(value[1])}`);
      else if (value && value instanceof Date) params = params.append(key, formatarData(value));
    } else {
      params = params.append(key, value.toString());
    }
  }
  return params.toString();
}
