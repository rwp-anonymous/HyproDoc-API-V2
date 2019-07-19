import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialRequisitionNoteRepository } from '../material-requisition-notes/material-requisition-note.repository';
import { StoreRequisitionNoteRepository } from '../store-requisition-notes/store-requisition-note.repository';
import { PurchaseOrderRepository } from '../purchase-orders/purchase-order.repository';
import { GoodsReceivedNoteRepository } from '../goods-received-notes/goods-received-note.repository';
import { GoodsIssueNoteRepository } from '../goods-issue-notes/goods-issue-note.repository';
import { ItemRepository } from '../items/item.repository';
import { UserRepository } from '../auth/user.repository';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(MaterialRequisitionNoteRepository)
        private materialRequisitionNoteRepository: MaterialRequisitionNoteRepository,

        @InjectRepository(StoreRequisitionNoteRepository)
        private storeRequisitionNoteRepository: StoreRequisitionNoteRepository,

        @InjectRepository(PurchaseOrderRepository)
        private purchaseOrderRepository: PurchaseOrderRepository,

        @InjectRepository(GoodsReceivedNoteRepository)
        private goodsReceivedNoteRepository: GoodsReceivedNoteRepository,

        @InjectRepository(GoodsIssueNoteRepository)
        private goodsIssueNoteRepository: GoodsIssueNoteRepository,

        @InjectRepository(ItemRepository)
        private itemRepository: ItemRepository,

        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) { }

    async getDashboardCounts(): Promise<{}> {
        const mrnsCount = await this.materialRequisitionNoteRepository.count();
        const srnsCount = await this.storeRequisitionNoteRepository.count();
        const posCount = await this.purchaseOrderRepository.count();
        const grnsCount = await this.goodsReceivedNoteRepository.count();
        const ginsCount = await this.goodsIssueNoteRepository.count();
        const itemsCount = await this.itemRepository.count();
        const usersCount = await this.userRepository.count();

        const summary = {
            mrnsCount,
            srnsCount,
            posCount,
            grnsCount,
            ginsCount,
            itemsCount,
            usersCount
        }

        return summary;
    }
}
