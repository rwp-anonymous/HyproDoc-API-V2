import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialRequisitionNoteItemRepository } from './material-requisition-note-item.repository';
import { CreateMaterialRequisitionNoteItemDto } from './dto/create-material-requisition-note-item.dto';
import { MaterialRequisitionNoteItem } from './material-requisition-note-item.entity';

@Injectable()
export class MaterialRequisitionNoteItemsService {
    constructor(
        @InjectRepository(MaterialRequisitionNoteItemRepository)
        private itemRepository: MaterialRequisitionNoteItemRepository
    ) { }

    async createItem(
        createItemDto: CreateMaterialRequisitionNoteItemDto
    ): Promise<MaterialRequisitionNoteItem> {
        return this.itemRepository.createItem(createItemDto);
    }
}
