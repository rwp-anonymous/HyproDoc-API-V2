import { Module } from '@nestjs/common';
import { MaterialRequisitionNotesController } from './material-requisition-notes.controller';
import { MaterialRequisitionNotesService } from './material-requisition-notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialRequisitionNoteRepository } from './material-requisition-note.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaterialRequisitionNoteRepository]),
  ],
  controllers: [MaterialRequisitionNotesController],
  providers: [MaterialRequisitionNotesService]
})
export class MaterialRequisitionNotesModule { }
