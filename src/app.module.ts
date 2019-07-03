import { Module } from '@nestjs/common';
import { MaterialRequisitionNotesModule } from './material-requisition-notes/material-requisition-notes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MaterialRequisitionNotesModule
  ]
})
export class AppModule { }
