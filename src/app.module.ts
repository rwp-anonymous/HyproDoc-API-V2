import { Module } from '@nestjs/common';
import { MaterialRequisitionNotesModule } from './material-requisition-notes/material-requisition-notes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { MaterialRequisitionNoteItemsModule } from './material-requisition-note-items/material-requisition-note-items.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MaterialRequisitionNotesModule,
    AuthModule,
    ItemsModule,
    MaterialRequisitionNoteItemsModule,
    DashboardModule
  ]
})
export class AppModule { }
