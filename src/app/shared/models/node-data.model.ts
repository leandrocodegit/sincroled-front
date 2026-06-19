
export class PublicarWorkflowRequest {
  constructor(
    public versionId?: string,
    public name?: any ,
    public description?: string,
    public expectedChecksum?: string
  ) { }
}

export class NameValue {
  constructor(
    public name: string = '',
    public value: any = ''
  ) { }
}


export class NameValueList {
  constructor(public parameters: NameValue[] = []) { }
}

export class HttpRequestResponseOptions {
  fullResponse: boolean = false;
  neverError: boolean = false;
}

export class HttpRequestRedirectOptions {
  followRedirects?: boolean;
}

export class HttpRequestPagination {
  parameters: NameValueList = new NameValueList();
  limitPagesFetched: boolean = false;
}

export class HttpRequestOptions {
  batching: { batch: Record<string, any> } = { batch: {} };

  allowUnauthorizedCerts: boolean = false;
  queryParameterArrays: 'brackets' | 'indices' | 'repeat' | 'comma' | string = 'brackets';
  lowercaseHeaders: boolean = false;

  redirect: { redirect: HttpRequestRedirectOptions } = { redirect: new HttpRequestRedirectOptions() };
  response: { response: HttpRequestResponseOptions } = { response: new HttpRequestResponseOptions() };
  pagination?: { pagination: HttpRequestPagination } = { pagination: new HttpRequestPagination() };

  proxy: string = '';
  timeout: number = 10000;
}

export class HttpRequestParameters {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string = 'GET';
  authentication: any = {};

  url: string = '';
  provideSslCertificates: boolean = false;

  jsonBody: string = '';
  contentType: 'json' | 'multipart-form-data' | 'form-urlencoded' | 'raw' | string = 'json';

  sendQuery: boolean = false;
  queryParameters: NameValueList = new NameValueList();

  sendHeaders: boolean = false;
  headerParameters: NameValueList = new NameValueList();

  sendBody: boolean = false;
  bodyParameters: NameValueList = new NameValueList();

  options: HttpRequestOptions = new HttpRequestOptions();
}

export class N8nHttpRequestNode {
  type: 'n8n-nodes-base.httpRequest' = 'n8n-nodes-base.httpRequest';
  typeVersion: number = 4.3;

  position: [number, number] = [0, 0];

  id: string = '';
  name: string = 'HTTP Request';

  alwaysOutputData: boolean = false;
  executeOnce: boolean = false;
  retryOnFail: boolean = false;
  notesInFlow?: boolean = false;
  notes?: string = '';
  onError?: string = 'continueRegularOutput';
  waitBetweenTries?: number = 1000;

  startedAt?: Date;

  parameters: HttpRequestParameters = new HttpRequestParameters();

  constructor(init?: Partial<N8nHttpRequestNode>) {
    Object.assign(this, init);

    this.alwaysOutputData = init?.alwaysOutputData ?? false;
    this.executeOnce = init?.executeOnce ?? false;
    this.retryOnFail = init?.retryOnFail ?? false;
    this.notesInFlow = init?.notesInFlow ?? false;
    this.notes = init?.notes ?? '';
    this.onError = init?.onError ?? 'continueRegularOutput';
    this.waitBetweenTries = init?.waitBetweenTries ?? 1000;

    // Normaliza sub-objetos (pra não quebrar ngModel)
    this.parameters ??= new HttpRequestParameters();
    this.parameters.options ??= new HttpRequestOptions();
    this.parameters.queryParameters ??= new NameValueList();
    this.parameters.headerParameters ??= new NameValueList();
    this.parameters.bodyParameters ??= new NameValueList();
    this.parameters.options.pagination ??= { pagination: new HttpRequestPagination() };

    // Normaliza listas internas
    this.parameters.queryParameters.parameters ??= [];
    this.parameters.headerParameters.parameters ??= [];
    this.parameters.bodyParameters.parameters ??= [];
    this.parameters.options.pagination.pagination.parameters.parameters ??= [];
  }
}



export class WrokFlowData {
  data: {
    nodes: N8nHttpRequestNode[]
  }
}
