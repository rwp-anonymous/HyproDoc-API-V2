import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MaterialRequisitionNoteRepository } from '../material-requisition-notes/material-requisition-note.repository';
import { StoreRequisitionNoteRepository } from '../store-requisition-notes/store-requisition-note.repository';
import { PurchaseOrderRepository } from '../purchase-orders/purchase-order.repository';
import { GoodsReceivedNoteRepository } from '../goods-received-notes/goods-received-note.repository';
import { GoodsIssueNoteRepository } from '../goods-issue-notes/goods-issue-note.repository';
import { ItemRepository } from '../items/item.repository';
import { UserRepository } from '../auth/user.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaterialRequisitionNoteRepository,
      StoreRequisitionNoteRepository,
      PurchaseOrderRepository,
      GoodsReceivedNoteRepository,
      GoodsIssueNoteRepository,
      ItemRepository,
      UserRepository
    ]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
