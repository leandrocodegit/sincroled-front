export interface JobDefinitionRequest { 
  includeJobs: boolean;
  executionDate: Date | string;
  suspended: boolean;
}
