import { Module } from '@nestjs/common';
import { StoreRequisitionNoteItemsController } from './store-requisition-note-items.controller';
import { StoreRequisitionNoteItemsService } from './store-requisition-note-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { StoreRequisitionNoteItemRepository } from './store-requisition-note-item.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreRequisitionNoteItemRepository]),
    AuthModule,
  ],
  controllers: [StoreRequisitionNoteItemsController],
  providers: [StoreRequisitionNoteItemsService]
})
export class StoreRequisitionNoteItemsModule { }
