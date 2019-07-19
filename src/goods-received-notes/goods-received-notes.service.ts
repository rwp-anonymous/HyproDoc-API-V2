import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateGoodsReceivedNoteDto } from './dto/create-goods-received-note.dto';
import { GetGoodsReceivedNotesFilterDto } from './dto/get-goods-received-notes-filter.dto';
import { GoodsReceivedNoteRepository } from './goods-received-note.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsReceivedNote } from './goods-received-note.entity';
import { User } from '../auth/user.entity';
import { UserRoles } from '../auth/user-roles.enum';

@Injectable()
export class GoodsReceivedNotesService {
    constructor(
        @InjectRepository(GoodsReceivedNoteRepository)
        private goodsReceivedNoteRepository: GoodsReceivedNoteRepository
    ) { }

    async getGoodsReceivedNotes(
        filterDto: GetGoodsReceivedNotesFilterDto,
        user: User
    ): Promise<GoodsReceivedNote[]> {
        return this.goodsReceivedNoteRepository.getGoodsReceivedNotes(filterDto, user);
    }

    async getGoodsReceivedNoteById(
        id: number,
        user: User,
        isUpdateRequest: boolean = false
    ): Promise<GoodsReceivedNote> {
        let found;

        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.STORE_KEEPER
        ]

        if (isUpdateRequest || this.isRoleValid(user.role, allowedRoles)) {
            found = await this.goodsReceivedNoteRepository.findOne(id, { relations: ["items", "acknowledgedBy", "goodsReceivedNoteItems"] });
        } else {
            await this.goodsReceivedNoteRepository.findOne({
                where: [
                    { id, acknowledgedById: user.id }
                ],
                relations: ["items", "goodsReceivedNoteItems"]
            });
        }

        if (!found) {
            throw new NotFoundException(`Goods Received Note with ID ${id} not found`);
        } else {
            delete found.acknowledgedBy.password;
        }

        return found;
    }

    async createGoodsReceivedNote(
        createGoodsReceivedNoteDto: CreateGoodsReceivedNoteDto,
        user: User
    ): Promise<GoodsReceivedNote> {
        return this.goodsReceivedNoteRepository.createGoodsReceivedNote(createGoodsReceivedNoteDto, user);
    }

    async deleteGoodsReceivedNote(id: number, user: User): Promise<void> {
        let result;
        if (user.role === UserRoles.ADMIN) {
            result = await this.goodsReceivedNoteRepository.delete(id);
        } else {
            throw new NotFoundException(`Goods Received Note with ID ${id} not found`);
        }

        if (result && result.affected === 0) {
            throw new NotFoundException(`Goods Received Note with ID ${id} not found`);
        }
    }

    async generateGoodsReceivedNoteNumber(): Promise<{}> {
        const [lastGoodsReceivedNote] = await this.goodsReceivedNoteRepository.find({
            order: { id: "DESC" },
            take: 1
        });

        let lastNumber = parseInt(lastGoodsReceivedNote.grnNo.replace(/^\D+/g, ''));
        let standardLastNumber = (lastNumber + 1).toString().padStart(3, '0');
        return { nextNumber: `grn-${standardLastNumber}` };
    }

    private isRoleValid(role: any, allowedRoles: UserRoles[]) {
        const idx = allowedRoles.indexOf(role);
        return idx !== -1;
    }
}
