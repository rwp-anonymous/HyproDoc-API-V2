import { Module } from '@nestjs/common';
import { MaterialRequisitionNotesModule } from './material-requisition-notes/material-requisition-notes.module';

@Module({
  imports: [MaterialRequisitionNotesModule]
})
export class AppModule { }
