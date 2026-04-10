import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { FuelController } from './fuel.controller';
import { FuelService } from './fuel.service';
import { OilChangeController } from './oil-change.controller';
import { OilChangeService } from './oil-change.service';

@Module({
  controllers: [VehiclesController, MaintenanceController, FuelController, OilChangeController],
  providers: [VehiclesService, MaintenanceService, FuelService, OilChangeService],
  exports: [VehiclesService, OilChangeService],
})
export class FleetModule {}
