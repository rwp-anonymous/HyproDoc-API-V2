import { Repository, EntityRepository } from "typeorm";
import { InternalServerErrorException, ConflictException } from "@nestjs/common";
import { CreateGoodsReceivedNoteItemDto } from "./dto/create-goods-received-note-item.dto";
import { GoodsReceivedNoteItem } from "./goods-received-note-item.entity";

@EntityRepository(GoodsReceivedNoteItem)
export class GoodsReceivedNoteItemRepository extends Repository<GoodsReceivedNoteItem> {
    async createItem(
        createGoodsReceivedNoteItemDto: CreateGoodsReceivedNoteItemDto
    ): Promise<GoodsReceivedNoteItem> {
        // if (user.role === UserRoles.STORE_KEEPER || user.role === UserRoles.ADMIN) {
        const { code, comments, unit, orderedQuantity, deliveredQuantity, pricePerUnit } = createGoodsReceivedNoteItemDto;

        const item = new GoodsReceivedNoteItem();

        item.code = code;
        item.comments = comments;
        item.unit = unit;
        item.orderedQuantity = orderedQuantity;
        item.deliveredQuantity = deliveredQuantity;
        item.pricePerUnit = pricePerUnit;

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