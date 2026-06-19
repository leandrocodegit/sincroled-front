export interface FilterVariableinstance {
  processInstanceId?: string;
  variableTypeIn?: string[];
  variableName?: string;
  deserializeValues?: boolean;
  processInstanceIdIn?: string[];
  processDefinitionKey?: string;
  processDefinitionId?: string;
  noLoad?: boolean;
  maxResults?: number;
}
