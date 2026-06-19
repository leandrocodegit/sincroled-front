import { formatarData } from "./DateUtil";

export function gerarDataForm(data: any): FormData {
  const formData = new FormData();

  if (data.formKey)
    formData.append('formKey', data.formKey);

  for (const key in data.data) {
    const value = data.data[key];

    if (typeof value === 'string' && value.startsWith("files::")) {
      const file = data.files.get(value);
      if (file) {
        formData.append(key, file[0]);
      }
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  }
  return formData;
}

export function gerarVariaveisForm(task: any, data: any): FormData {
  var variaveis: any = {};
  for (const key in data.data) {
    const value = data.data[key];

    if (typeof value === 'string' && value.startsWith("files::")) {
      const file = data.files.get(value);
      if (file) {
        variaveis[key] = {
          type: 'File',
          value: `forms/${task.processInstanceId}/${file[0].name}`,
          valueInfo: {
            filename: file[0].name,
            mimeType: file[0].type
          }
        };
      }
    }
    else if (value !== null && value !== undefined) {
      var dataValue = value;
      var valueInfo = {}
      if (data.tipagem.get(key) == 'Date')
        dataValue = formatarData(new Date(value));
      if (data.tipagem.get(key) == 'Object'){
         dataValue = JSON.stringify(value)
        valueInfo = {
          objectTypeName: 'java.util.ArrayList',
          serializationDataFormat: 'application/json'
        }
      }

      variaveis[key] = {
        type: data.tipagem.get(key),
        value: dataValue,
        valueInfo: valueInfo
      };
    }
  }
  return variaveis;
}

export function recuperarColunasTabelaForm(data: any) {
  var colunas: any[] = [];
  var value = data;

  try {
    value = JSON.parse(data);
  } catch (error) {
    value = data;
  }

  if (isStringArray(value)) {
    for (let index = 0; index < value.length; index++) {
      colunas.push({
        key: index,
        label: `Item ${index}`
      });
    }
    return colunas;
  }

  var dataVar = (value instanceof Array) ? value[0] : value

  dataVar = (dataVar instanceof Array) ? dataVar[0] : dataVar

  console.log('DAtaVar', dataVar);

  for (const key in dataVar) {
    colunas.push({
      key: key,
      label: key
    });
  }
  return colunas;
}

export function isStringArray(value: any): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

export function extrairAttributesUsuario(data: any): FormData {
  for (const key in data.attributes) {
    const value = data.attributes[key];
    if (value !== null && value !== undefined) {
      data[key] = value[0];
    }
  }
  return data;
}

export function formatarDataUsuario(data: any, userData: any): FormData {

  let attributes = {};
  userData.userProfileMetadata.attributes.forEach(input => {
    const key = input.name;
    const value = data[key];
    if (value !== null && value !== undefined) {
      if (!userData[key])
        attributes[key] = value;
      else userData[key] = value;
    }
  });
  userData['attributes'] = attributes;
  return userData;
}


export function stringifyComExpressoes(
  obj: any,
  indent = 2,
  ignorarChaves?: Set<string>
): string {
  const PLACEHOLDER_PREFIX = '__EXPR_';
  const expressoes = new Map<string, string>();
  let contador = 0;

  // 1. Substitui cada valor "${...}" por um placeholder único,
  //    ignorando campos cujo nome pai esteja em ignorarChaves
  function substituirExpressoes(value: any, chaveParent?: string): any {
    if (ignorarChaves?.has(chaveParent)) return value;

    if (typeof value === 'string' && value.trim().startsWith('${')) {
      const placeholder = `"${PLACEHOLDER_PREFIX}${contador++}"`;
      expressoes.set(placeholder, value.trim());
      return `${PLACEHOLDER_PREFIX}${contador - 1}`;
    }
    if (Array.isArray(value)) return value.map(item => substituirExpressoes(item));
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, substituirExpressoes(v, k)])
      );
    }
    return value;
  }

  // 2. Restaura os placeholders como expressões sem aspas
  function restaurarExpressoes(json: string): string {
    expressoes.forEach((expressao, placeholder) => {
      json = json.replace(placeholder, expressao);
    });
    return json;
  }

  const objComPlaceholders = substituirExpressoes(obj);
  const jsonIntermediario = JSON.stringify(objComPlaceholders, null, indent);
  return restaurarExpressoes(jsonIntermediario).replaceAll('\\"', '"');
}

export interface CampoEntrada {
  key: string;
  value: string;
}

export interface ResultadoParse {
  detail: CampoEntrada[];
  parameter: Record<string, any> | null;
}

/**
 * Converte o JSON achatado (com expressões ${...} sem aspas) para:
 *   - detail: lista de CampoEntrada
 *   - parametros: objeto simples (se existir no JSON)
 */
export function parseParaFormatoEntrada(json: string): ResultadoParse {
  const obj = parseComExpressoes(json);

  const detail: CampoEntrada[] = Object.entries(obj.detail ?? obj).map(([key, valor]) => ({
    key,
    value: String(valor ?? '')
  }));

  const parameter = obj.parameter ?? null;

  return { detail, parameter };
}


export function parseComExpressoes(json?: string): any {

  if (!json)
    return;

  // 1. Expressões SEM aspas: ${...} → "${...}" (escapando aspas internas)
  let normalizado = json.replace(/(?<!["\\])\$\{([^}]+)\}/g, (_, inner) => {
    const escapado = inner.replace(/"/g, '\\"');
    return `"\${${escapado}}"`;
  });

  // 2. Expressões JÁ COM aspas mas com aspas internas não escapadas: "${...getVariable("x")...}"
  normalizado = normalizado.replace(/"(\$\{[^}]*\})"/g, (_, expr) => {
    const escapado = expr.replace(/(?<!\\)"/g, '\\"');
    return `"${escapado}"`;
  });

  return JSON.parse(normalizado);
}

export function parseListValues(data: any) {

  let variable: any[] = []

  for (const key in data) {
    const value = data[key];
    variable.push({
      key: key,
      value: value
    })
  }
  return variable;
}
