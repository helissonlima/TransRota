import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { ProductionController } from './production.controller';
import { ProductionService } from './production.service';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  controllers: [ProductsController, InventoryController, ProductionController, SalesController],
  providers: [ProductsService, InventoryService, ProductionService, SalesService],
})
export class ProductsModule {}
