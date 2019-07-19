import { Module } from '@nestjs/common';
import { GoodsReceivedNoteItemsController } from './goods-received-note-items.controller';
import { GoodsReceivedNoteItemsService } from './goods-received-note-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GoodsReceivedNoteItemRepository } from './goods-received-note-item.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoodsReceivedNoteItemRepository]),
    AuthModule,
  ],
  controllers: [GoodsReceivedNoteItemsController],
  providers: [GoodsReceivedNoteItemsService]
})
export class GoodsReceivedNoteItemsModule { }
