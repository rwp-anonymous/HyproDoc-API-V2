import { Repository, EntityRepository, getConnection } from "typeorm";
import { GoodsIssueNote } from "./goods-issue-note.entity";
import { CreateGoodsIssueNoteDto } from "./dto/create-goods-issue-note.dto";
import { GoodsIssueNoteStatus } from "./goods-issue-note-status.enum";
import { GetGoodsIssueNotesFilterDto } from "./dto/get-goods-issue-notes-filter.dto";
import { User } from "../auth/user.entity";
import { UserRoles } from "../auth/user-roles.enum";
import { ConflictException, InternalServerErrorException, Logger, UnauthorizedException, MethodNotAllowedException } from "@nestjs/common";
import { GoodsIssueNoteItem } from "../goods-issue-note-items/goods-issue-note-item.entity";
import { Item } from "../items/item.entity";

@EntityRepository(GoodsIssueNote)
export class GoodsIssueNoteRepository extends Repository<GoodsIssueNote> {
    private logger = new Logger('GoodsIssueNoteRepository');

    async getGoodsIssueNotes(
        filterDto: GetGoodsIssueNotesFilterDto,
        user: User
    ): Promise<GoodsIssueNote[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('goodsIssueNote');

        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.SITE_ENGINEER,
            UserRoles.STORE_KEEPER
        ]

        if (!this.isRoleValid(user.role, allowedRoles)) {
            query.where('(goodsIssueNote.issuedById = :userId OR goodsIssueNote.receivedById = :userId)', { userId: user.id })
        }

        if (status) {
            query.andWhere('goodsIssueNote.status = :status', { status })
        }

        if (search) {
            query.andWhere('(goodsIssueNote.ginNo LIKE :search OR goodsIssueNote.siteLocation LIKE :search)', { search: `%${search}%` })
        }

        try {
            const goodsIssueNotes = await query
                .leftJoinAndSelect("goodsIssueNote.items", "item")
                .leftJoinAndSelect("goodsIssueNote.goodsIssueNoteItems", "goodsIssueNoteItem")
                .innerJoinAndSelect("goodsIssueNote.issuedBy", "user")
                .getMany();

            const newGoodsIssueNotes = goodsIssueNotes.map(({ issuedBy: { password, ...restOfObj }, ...restOfNote }) => Object.assign({ ...restOfNote, issuedBy: restOfObj }))

            return newGoodsIssueNotes;
        } catch (error) {
            this.logger.error(`Failed to get goods issue notes for user "${user.email}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createGoodsIssueNote(
        createGoodsIssueNoteDto: CreateGoodsIssueNoteDto,
        user: User
    ): Promise<GoodsIssueNote> {
        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.STORE_KEEPER
        ]

        if (this.isRoleValid(user.role, allowedRoles)) {

            const { ginNo, siteLocation, items, goodsIssueNoteItems } = createGoodsIssueNoteDto;

            const savedGoodsIssueNoteItems = await this.createGoodsIssueNoteItems(goodsIssueNoteItems);

            const goodsIssueNote = new GoodsIssueNote();
            goodsIssueNote.ginNo = ginNo;
            goodsIssueNote.siteLocation = siteLocation;
            goodsIssueNote.issuedDate = new Date();
            goodsIssueNote.issuedBy = user;
            goodsIssueNote.items = items;
            goodsIssueNote.goodsIssueNoteItems = savedGoodsIssueNoteItems;
            goodsIssueNote.status = GoodsIssueNoteStatus.ISSUED;

            try {
                await goodsIssueNote.save();
            } catch (error) {
                this.logger.error(`Failed to create a  goods issue note for user "${user.email}". DTO: ${JSON.stringify(createGoodsIssueNoteDto)}`, error.stack);

                if (error.code === '23505') {   // duplicate gin
                    throw new ConflictException('Duplicate GIN Number');
                } else {
                    throw new InternalServerErrorException();
                }
            }

            delete goodsIssueNote.issuedBy;

            return goodsIssueNote;
        } else {
            throw new UnauthorizedException();
        }
    }

    async createGoodsIssueNoteItems(items: GoodsIssueNoteItem[]): Promise<GoodsIssueNoteItem[]> {
        let savedGoodsIssueNoteItems: GoodsIssueNoteItem[] = [];
        for await (const item of items) {
            const newItem = new GoodsIssueNoteItem();
            newItem.mrnNo = item.mrnNo;
            newItem.code = item.code;
            newItem.description = item.description;
            newItem.remarks = item.remarks;
            newItem.unit = item.unit;
            newItem.issuedQuantity = item.issuedQuantity;

            try {
                await newItem.save();
                await this.updateItemsQuantities(item);
            } catch (error) {
                if (error.code === '23505') {   // duplicate gin
                    throw new ConflictException('Duplicate GIN Number');
                } else {
                    throw new InternalServerErrorException();
                }
            }
            savedGoodsIssueNoteItems.push(newItem);
        }
        return savedGoodsIssueNoteItems;
    }

    async updateItemsQuantities(item: GoodsIssueNoteItem): Promise<void> {
        try {
            const itemToUpdate = await getConnection().getRepository(Item)
                .findOne({
                    where: [
                        { code: item.code }
                    ]
                });

            const updatedQty = Number(itemToUpdate.quantity) - Number(item.issuedQuantity)

            if (updatedQty < itemToUpdate.threshold) {
                throw new MethodNotAllowedException('Lower than threshold');
            } else {
                await getConnection().getRepository(Item)
                    .update({ code: item.code }, { quantity: updatedQty })
            }
        } catch (error) {
            throw new MethodNotAllowedException('Lower than threshold');
        }
    }

    private isRoleValid(role: any, allowedRoles: UserRoles[]) {
        const idx = allowedRoles.indexOf(role);
        return idx !== -1;
    }
}