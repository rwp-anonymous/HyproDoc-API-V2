import { Module } from '@nestjs/common';
import { GoodsIssueNotesController } from './goods-issue-notes.controller';
import { GoodsIssueNotesService } from './goods-issue-notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GoodsIssueNoteRepository } from './goods-issue-note.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoodsIssueNoteRepository]),
    AuthModule,
  ],
  controllers: [GoodsIssueNotesController],
  providers: [GoodsIssueNotesService]
})
export class GoodsIssueNotesModule { }
