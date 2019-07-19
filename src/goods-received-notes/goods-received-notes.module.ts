import { Module } from '@nestjs/common';
import { GoodsReceivedNotesController } from './goods-received-notes.controller';
import { GoodsReceivedNotesService } from './goods-received-notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GoodsReceivedNoteRepository } from './goods-received-note.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoodsReceivedNoteRepository]),
    AuthModule,
  ],
  controllers: [GoodsReceivedNotesController],
  providers: [GoodsReceivedNotesService]
})
export class GoodsReceivedNotesModule { }
