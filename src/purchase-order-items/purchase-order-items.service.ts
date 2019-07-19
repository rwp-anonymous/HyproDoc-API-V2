import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderItemRepository } from './purchase-order-item.repository';
import { CreatePurchaseOrderItemDto } from './dto/create-purchase-order-item.dto';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Injectable()
export class PurchaseOrderItemsService {
    constructor(
        @InjectRepository(PurchaseOrderItemRepository)
        private itemRepository: PurchaseOrderItemRepository
    ) { }

    async createItem(
        createItemDto: CreatePurchaseOrderItemDto
    ): Promise<PurchaseOrderItem> {
        return this.itemRepository.createItem(createItemDto);
    }
}
