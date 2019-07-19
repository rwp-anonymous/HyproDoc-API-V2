import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsReceivedNoteItemRepository } from './goods-received-note-item.repository';
import { CreateGoodsReceivedNoteItemDto } from './dto/create-goods-received-note-item.dto';
import { GoodsReceivedNoteItem } from './goods-received-note-item.entity';

@Injectable()
export class GoodsReceivedNoteItemsService {
    constructor(
        @InjectRepository(GoodsReceivedNoteItemRepository)
        private itemRepository: GoodsReceivedNoteItemRepository
    ) { }

    async createItem(
        createItemDto: CreateGoodsReceivedNoteItemDto
    ): Promise<GoodsReceivedNoteItem> {
        return this.itemRepository.createItem(createItemDto);
    }
}
