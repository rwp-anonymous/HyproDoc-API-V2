import { Module } from '@nestjs/common';
import { MaterialRequisitionNotesModule } from './material-requisition-notes/material-requisition-notes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { MaterialRequisitionNoteItemsModule } from './material-requisition-note-items/material-requisition-note-items.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StoreRequisitionNotesModule } from './store-requisition-notes/store-requisition-notes.module';
import { StoreRequisitionNoteItemsModule } from './store-requisition-note-items/store-requisition-note-items.module';
import { PurchaseOrderItemsModule } from './purchase-order-items/purchase-order-items.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { GoodsReceivedNotesModule } from './goods-received-notes/goods-received-notes.module';
import { GoodsReceivedNoteItemsModule } from './goods-received-note-items/goods-received-note-items.module';
import { GoodsIssueNotesModule } from './goods-issue-notes/goods-issue-notes.module';
import { GoodsIssueNoteItemsModule } from './goods-issue-note-items/goods-issue-note-items.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MaterialRequisitionNotesModule,
    AuthModule,
    ItemsModule,
    MaterialRequisitionNoteItemsModule,
    DashboardModule,
    StoreRequisitionNotesModule,
    StoreRequisitionNoteItemsModule,
    PurchaseOrderItemsModule,
    PurchaseOrdersModule,
    GoodsReceivedNotesModule,
    GoodsReceivedNoteItemsModule,
    GoodsIssueNotesModule,
    GoodsIssueNoteItemsModule
  ]
})
export class AppModule { }
