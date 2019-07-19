import { Repository, EntityRepository } from "typeorm";
import { InternalServerErrorException, ConflictException } from "@nestjs/common";
import { CreateGoodsIssueNoteItemDto } from "./dto/create-goods-issue-note-item.dto";
import { GoodsIssueNoteItem } from "./goods-issue-note-item.entity";

@EntityRepository(GoodsIssueNoteItem)
export class GoodsIssueNoteItemRepository extends Repository<GoodsIssueNoteItem> {
    async createItem(
        createGoodsIssueNoteItemDto: CreateGoodsIssueNoteItemDto
    ): Promise<GoodsIssueNoteItem> {
        // if (user.role === UserRoles.STORE_KEEPER || user.role === UserRoles.ADMIN) {
        const { mrnNo, code, description, remarks, unit, issuedQuantity } = createGoodsIssueNoteItemDto;

        const item = new GoodsIssueNoteItem();

        item.mrnNo = mrnNo;
        item.code = code;
        item.description = description;
        item.remarks = remarks;
        item.unit = unit;
        item.issuedQuantity = issuedQuantity;

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