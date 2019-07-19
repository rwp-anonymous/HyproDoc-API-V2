import { Repository, EntityRepository, getConnection } from "typeorm";
import { GoodsReceivedNote } from "./goods-received-note.entity";
import { CreateGoodsReceivedNoteDto } from "./dto/create-goods-received-note.dto";
import { GetGoodsReceivedNotesFilterDto } from "./dto/get-goods-received-notes-filter.dto";
import { User } from "../auth/user.entity";
import { UserRoles } from "../auth/user-roles.enum";
import { ConflictException, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { GoodsReceivedNoteItem } from "../goods-received-note-items/goods-received-note-item.entity";
import { ItemRepository } from "../items/item.repository";
import { Item } from "../items/item.entity";

@EntityRepository(GoodsReceivedNote)
export class GoodsReceivedNoteRepository extends Repository<GoodsReceivedNote> {
    private logger = new Logger('GoodsReceivedNoteRepository');

    async getGoodsReceivedNotes(
        filterDto: GetGoodsReceivedNotesFilterDto,
        user: User
    ): Promise<GoodsReceivedNote[]> {
        const { search } = filterDto;
        const query = this.createQueryBuilder('goodsReceivedNote');

        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.STORE_KEEPER
        ]

        if (!this.isRoleValid(user.role, allowedRoles)) {
            query.where('(goodsReceivedNote.acknowledgedById = :userId)', { userId: user.id })
        }

        if (search) {
            query.andWhere('(goodsReceivedNote.grnNo LIKE :search OR goodsReceivedNote.siteLocation LIKE :search)', { search: `%${search}%` })
        }

        try {
            const goodsReceivedNotes = await query
                .leftJoinAndSelect("goodsReceivedNote.items", "item")
                .leftJoinAndSelect("goodsReceivedNote.goodsReceivedNoteItems", "goodsReceivedNoteItem")
                .innerJoinAndSelect("goodsReceivedNote.acknowledgedBy", "user")
                .getMany();

            const newGoodsReceivedNotes = goodsReceivedNotes.map(({ acknowledgedBy: { password, ...restOfObj }, ...restOfNote }) => Object.assign({ ...restOfNote, acknowledgedBy: restOfObj }))

            return newGoodsReceivedNotes;
        } catch (error) {
            this.logger.error(`Failed to get goods received notes for user "${user.email}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createGoodsReceivedNote(
        createGoodsReceivedNoteDto: CreateGoodsReceivedNoteDto,
        user: User
    ): Promise<GoodsReceivedNote> {
        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.STORE_KEEPER
        ]

        if (this.isRoleValid(user.role, allowedRoles)) {

            const { grnNo, siteLocation, supplier, items, goodsReceivedNoteItems } = createGoodsReceivedNoteDto;

            const savedGoodsReceivedNoteItems = await this.createGoodsReceivedNoteItems(goodsReceivedNoteItems);

            const goodsReceivedNote = new GoodsReceivedNote();
            goodsReceivedNote.grnNo = grnNo;
            goodsReceivedNote.siteLocation = siteLocation;
            goodsReceivedNote.supplier = supplier;
            goodsReceivedNote.acknowledgedDate = new Date();
            goodsReceivedNote.acknowledgedBy = user;
            goodsReceivedNote.items = items;
            goodsReceivedNote.goodsReceivedNoteItems = savedGoodsReceivedNoteItems;

            try {
                await goodsReceivedNote.save();
            } catch (error) {
                this.logger.error(`Failed to create a  goods received note for user "${user.email}". DTO: ${JSON.stringify(createGoodsReceivedNoteDto)}`, error.stack);

                if (error.code === '23505') {   // duplicate grn
                    throw new ConflictException('Duplicate GRN Number');
                } else {
                    throw new InternalServerErrorException();
                }
            }

            delete goodsReceivedNote.acknowledgedBy;

            return goodsReceivedNote;
        } else {
            throw new UnauthorizedException();
        }
    }

    async createGoodsReceivedNoteItems(items: GoodsReceivedNoteItem[]): Promise<GoodsReceivedNoteItem[]> {
        let savedGoodsReceivedNoteItems: GoodsReceivedNoteItem[] = [];
        for await (const item of items) {
            const newItem = new GoodsReceivedNoteItem();
            newItem.code = item.code;
            newItem.comments = item.comments;
            newItem.unit = item.unit;
            newItem.orderedQuantity = item.orderedQuantity;
            newItem.deliveredQuantity = item.deliveredQuantity;
            newItem.pricePerUnit = item.pricePerUnit;

            try {
                await newItem.save();
                await this.updateItemsQuantities(item);
            } catch (error) {
                if (error.code === '23505') {   // duplicate grn
                    throw new ConflictException('Duplicate GRN Number');
                } else {
                    console.log(error)
                    throw new InternalServerErrorException();
                }
            }
            savedGoodsReceivedNoteItems.push(newItem);
        }
        return savedGoodsReceivedNoteItems;
    }

    async updateItemsQuantities(item: GoodsReceivedNoteItem): Promise<void> {
        try {
            const itemToUpdate = await getConnection().getRepository(Item)
                .findOne({
                    where: [
                        { code: item.code }
                    ]
                });

            await getConnection().getRepository(Item)
                .update({ code: item.code }, { quantity: Number(itemToUpdate.quantity) + Number(item.deliveredQuantity) })

        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException();
        }
    }

    private isRoleValid(role: any, allowedRoles: UserRoles[]) {
        const idx = allowedRoles.indexOf(role);
        return idx !== -1;
    }
}