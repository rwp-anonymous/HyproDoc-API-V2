import { Module } from '@nestjs/common';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PurchaseOrdersService } from './purchase-orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PurchaseOrderRepository } from './purchase-order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrderRepository]),
    AuthModule,
  ],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService]
})
export class PurchaseOrdersModule { }
