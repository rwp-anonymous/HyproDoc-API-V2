import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsIssueNoteItemRepository } from './goods-issue-note-item.repository';
import { CreateGoodsIssueNoteItemDto } from './dto/create-goods-issue-note-item.dto';
import { GoodsIssueNoteItem } from './goods-issue-note-item.entity';

@Injectable()
export class GoodsIssueNoteItemsService {
    constructor(
        @InjectRepository(GoodsIssueNoteItemRepository)
        private itemRepository: GoodsIssueNoteItemRepository
    ) { }

    async createItem(
        createItemDto: CreateGoodsIssueNoteItemDto
    ): Promise<GoodsIssueNoteItem> {
        return this.itemRepository.createItem(createItemDto);
    }
}
