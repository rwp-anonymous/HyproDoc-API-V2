import { Module } from '@nestjs/common';
import { GoodsIssueNoteItemsController } from './goods-issue-note-items.controller';
import { GoodsIssueNoteItemsService } from './goods-issue-note-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GoodsIssueNoteItemRepository } from './goods-issue-note-item.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoodsIssueNoteItemRepository]),
    AuthModule,
  ],
  controllers: [GoodsIssueNoteItemsController],
  providers: [GoodsIssueNoteItemsService]
})
export class GoodsIssueNoteItemsModule { }
