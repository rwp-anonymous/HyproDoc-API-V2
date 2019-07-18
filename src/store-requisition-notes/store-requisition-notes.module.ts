import { Module } from '@nestjs/common';
import { StoreRequisitionNotesController } from './store-requisition-notes.controller';
import { StoreRequisitionNotesService } from './store-requisition-notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { StoreRequisitionNoteRepository } from './store-requisition-note.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreRequisitionNoteRepository]),
    AuthModule,
  ],
  controllers: [StoreRequisitionNotesController],
  providers: [StoreRequisitionNotesService]
})
export class StoreRequisitionNotesModule { }
