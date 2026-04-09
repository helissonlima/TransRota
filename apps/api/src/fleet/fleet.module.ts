import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { FuelController } from './fuel.controller';
import { FuelService } from './fuel.service';

@Module({
  controllers: [VehiclesController, MaintenanceController, FuelController],
  providers: [VehiclesService, MaintenanceService, FuelService],
  exports: [VehiclesService],
})
export class FleetModule {}
