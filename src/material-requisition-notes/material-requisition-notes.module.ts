import { Module } from '@nestjs/common';
import { MaterialRequisitionNotesController } from './material-requisition-notes.controller';

@Module({
  controllers: [MaterialRequisitionNotesController]
})
export class MaterialRequisitionNotesModule {}
