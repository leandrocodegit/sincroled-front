export interface VariableTypedMap {
  [key: string]: {
    name: string;
    value: any;
    type: string;
    valueInfo: {
      objectTypeName: string;
      serializationDataFormat: string;
    };
  };
}
