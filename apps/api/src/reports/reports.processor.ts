import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";

@Processor("reports")
export class ReportsProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportsProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing report job ${job.id} of type ${job.name}`);

    // Simulação de delay de relatório pesado
    await new Promise((resolve) => setTimeout(resolve, 5000));

    this.logger.log(`Report job ${job.id} completed successfully`);
    return { success: true, jobId: job.id };
  }
}
