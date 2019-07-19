import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateGoodsIssueNoteDto } from './dto/create-goods-issue-note.dto';
import { GetGoodsIssueNotesFilterDto } from './dto/get-goods-issue-notes-filter.dto';
import { GoodsIssueNoteRepository } from './goods-issue-note.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsIssueNote } from './goods-issue-note.entity';
import { GoodsIssueNoteStatus } from './goods-issue-note-status.enum';
import { User } from '../auth/user.entity';
import { UserRoles } from '../auth/user-roles.enum';

@Injectable()
export class GoodsIssueNotesService {
    constructor(
        @InjectRepository(GoodsIssueNoteRepository)
        private goodsIssueNoteRepository: GoodsIssueNoteRepository
    ) { }

    async getGoodsIssueNotes(
        filterDto: GetGoodsIssueNotesFilterDto,
        user: User
    ): Promise<GoodsIssueNote[]> {
        return this.goodsIssueNoteRepository.getGoodsIssueNotes(filterDto, user);
    }

    async getGoodsIssueNoteById(
        id: number,
        user: User,
        isUpdateRequest: boolean = false
    ): Promise<GoodsIssueNote> {
        let found;

        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.SITE_ENGINEER,
            UserRoles.STORE_KEEPER
        ]

        if (isUpdateRequest || this.isRoleValid(user.role, allowedRoles)) {
            found = await this.goodsIssueNoteRepository.findOne(id, { relations: ["items", "issuedBy", "goodsIssueNoteItems"] });
        } else {
            await this.goodsIssueNoteRepository.findOne({
                where: [
                    { id, issuedById: user.id },
                    { id, receivedById: user.id },
                ],
                relations: ["items", "goodsIssueNoteItems"]
            });
        }

        if (!found) {
            throw new NotFoundException(`Goods Issue Note with ID ${id} not found`);
        } else {
            delete found.issuedBy.password;
        }

        return found;
    }

    async createGoodsIssueNote(
        createGoodsIssueNoteDto: CreateGoodsIssueNoteDto,
        user: User
    ): Promise<GoodsIssueNote> {
        return this.goodsIssueNoteRepository.createGoodsIssueNote(createGoodsIssueNoteDto, user);
    }

    async deleteGoodsIssueNote(id: number, user: User): Promise<void> {
        let result;
        if (user.role === UserRoles.ADMIN) {
            result = await this.goodsIssueNoteRepository.delete(id);
        } else {
            throw new NotFoundException(`Goods Issue Note with ID ${id} not found`);
        }

        if (result && result.affected === 0) {
            throw new NotFoundException(`Goods Issue Note with ID ${id} not found`);
        }
    }

    async updateGoodsIssueNoteStatus(id: number, status: GoodsIssueNoteStatus, user: User): Promise<GoodsIssueNote> {
        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.SITE_ENGINEER
        ]

        const goodsIssueNote = await this.getGoodsIssueNoteById(id, user, true);

        if (goodsIssueNote.status === GoodsIssueNoteStatus.RECEIVED) {
            throw new ConflictException(`Goods Issue Note with id ${id} already been received`);
        } else if (!this.isRoleValid(user.role, allowedRoles)) {
            throw new UnauthorizedException();
        } else {
            goodsIssueNote.status = status;
            goodsIssueNote.receivedBy = user;
            goodsIssueNote.receivedDate = new Date();
            await goodsIssueNote.save();

            delete goodsIssueNote.receivedBy;

            return goodsIssueNote;
        }
    }

    async generateGoodsIssueNoteNumber(): Promise<{}> {
        const [lastGoodsIssueNote] = await this.goodsIssueNoteRepository.find({
            order: { id: "DESC" },
            take: 1
        });

        let lastNumber = parseInt(lastGoodsIssueNote.ginNo.replace(/^\D+/g, ''));
        let standardLastNumber = (lastNumber + 1).toString().padStart(3, '0');
        return { nextNumber: `gin-${standardLastNumber}` };
    }

    private isRoleValid(role: any, allowedRoles: UserRoles[]) {
        const idx = allowedRoles.indexOf(role);
        return idx !== -1;
    }
}
