import { Repository, EntityRepository } from "typeorm";
import { InternalServerErrorException, ConflictException } from "@nestjs/common";
import { StoreRequisitionNoteItem } from "./store-requisition-note-item.entity";
import { CreateStoreRequisitionNoteItemDto } from "./dto/create-store-requisition-note-item.dto";

@EntityRepository(StoreRequisitionNoteItem)
export class StoreRequisitionNoteItemRepository extends Repository<StoreRequisitionNoteItem> {
    async createItem(
        createStoreRequisitionNoteItemItemDto: CreateStoreRequisitionNoteItemDto
    ): Promise<StoreRequisitionNoteItem> {
        // if (user.role === UserRoles.STORE_KEEPER || user.role === UserRoles.ADMIN) {
        const { mrnNo, code, description, orderQuantity, unit } = createStoreRequisitionNoteItemItemDto;

        const item = new StoreRequisitionNoteItem();

        item.mrnNo = mrnNo;
        item.code = code;
        item.description = description;
        item.unit = unit;
        item.orderQuantity = orderQuantity;

        try {
            await item.save();
        } catch (error) {
            if (error.code === '23505') {   // duplicate item
                throw new ConflictException('Duplicate Item Code');
            } else {
                throw new InternalServerErrorException();
            }
        }

        return item;
        // } else {
        //     throw new UnauthorizedException();
        // }
    }
}