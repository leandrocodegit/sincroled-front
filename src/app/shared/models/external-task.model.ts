export interface ExternalTask {
  activityId: string;
  activityInstanceId: string;
  errorMessage: string | null;
  executionId: string;
  id: string;
  lockExpirationTime: string | Date;
  processDefinitionId: string;
  processDefinitionKey: string;
  processDefinitionVersionTag: string | null;
  processInstanceId: string;
  tenantId: string | null;
  retries: number;
  suspended: boolean;
  workerId: string | null;
  topicName: string;
  priority: number;
  businessKey: string | null;
}
