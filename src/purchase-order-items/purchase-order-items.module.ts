import { Module } from '@nestjs/common';
import { PurchaseOrderItemsController } from './purchase-order-items.controller';
import { PurchaseOrderItemsService } from './purchase-order-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PurchaseOrderItemRepository } from './purchase-order-item.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrderItemRepository]),
    AuthModule,
  ],
  controllers: [PurchaseOrderItemsController],
  providers: [PurchaseOrderItemsService]
})
export class PurchaseOrderItemsModule { }
