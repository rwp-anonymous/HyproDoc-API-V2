import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MaterialRequisitionNoteRepository } from '../material-requisition-notes/material-requisition-note.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([MaterialRequisitionNoteRepository]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
