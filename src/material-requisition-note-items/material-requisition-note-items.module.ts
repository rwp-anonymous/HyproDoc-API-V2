import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialRequisitionNoteItemsController } from './material-requisition-note-items.controller';
import { MaterialRequisitionNoteItemsService } from './material-requisition-note-items.service';
import { AuthModule } from '../auth/auth.module';
import { MaterialRequisitionNoteItemRepository } from './material-requisition-note-item.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaterialRequisitionNoteItemRepository]),
    AuthModule,
  ],
  controllers: [MaterialRequisitionNoteItemsController],
  providers: [MaterialRequisitionNoteItemsService]
})
export class MaterialRequisitionNoteItemsModule { }
