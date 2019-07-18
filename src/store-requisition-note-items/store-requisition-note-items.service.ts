import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreRequisitionNoteItemRepository } from './store-requisition-note-item.repository';
import { CreateStoreRequisitionNoteItemDto } from './dto/create-store-requisition-note-item.dto';
import { StoreRequisitionNoteItem } from './store-requisition-note-item.entity';

@Injectable()
export class StoreRequisitionNoteItemsService {
    constructor(
        @InjectRepository(StoreRequisitionNoteItemRepository)
        private itemRepository: StoreRequisitionNoteItemRepository
    ) { }

    async createItem(
        createItemDto: CreateStoreRequisitionNoteItemDto
    ): Promise<StoreRequisitionNoteItem> {
        return this.itemRepository.createItem(createItemDto);
    }
}
