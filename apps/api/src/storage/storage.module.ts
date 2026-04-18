import { Module } from "@nestjs/common";
import { MasterPrismaModule } from "../core/prisma/master-prisma.module";
import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";

@Module({
  imports: [MasterPrismaModule],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
