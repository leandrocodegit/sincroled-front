export class Modification {
  processDefinitionId: string;
  skipCustomListeners: boolean;
  skipIoMappings: boolean;
  processInstanceIds: string[];
  processInstanceQuery: {
    processDefinitionKey: string;
    businessKeyLike: string;
  };
  instructions: Instruction[];
  annotation: string;

  constructor(data: Partial<Modification> = {}) {
    this.processDefinitionId = data.processDefinitionId ?? '';
    this.skipCustomListeners = data.skipCustomListeners ?? false;
    this.skipIoMappings = data.skipIoMappings ?? false;
    this.processInstanceIds = data.processInstanceIds ?? [];
    this.processInstanceQuery = data.processInstanceQuery ?? {
      processDefinitionKey: '',
      businessKeyLike: ''
    };
    this.instructions = data.instructions ?? [];
    this.annotation = data.annotation ?? '';
  }
}


export class Instruction {
  type: string;
  activityId: string;
  cancelCurrentActiveActivityInstances: boolean

  constructor(data: Partial<Instruction> = {}) {
    this.type = data.type ?? 'cancel';
    this.activityId = data.activityId ?? '';
    this.cancelCurrentActiveActivityInstances = data.cancelCurrentActiveActivityInstances ?? false;
  }
}
