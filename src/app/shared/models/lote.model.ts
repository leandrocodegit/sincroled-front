export interface Lote {
  id: string;
  type: string;
  totalJobs: number;
  jobsCreated: number;
  batchJobsPerSeed: number;
  invocationsPerBatchJob: number;
  suspended: boolean;
  createUserId: string;
  startTime: string;
  endTime: string;
  failedJobs: number;
  remainingJobs: number;
  completedJobs: number
}
