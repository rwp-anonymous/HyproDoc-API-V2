import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateStoreRequisitionNoteDto } from './dto/create-store-requisition-note.dto';
import { GetStoreRequisitionNotesFilterDto } from './dto/get-store-requisition-notes-filter.dto';
import { StoreRequisitionNoteRepository } from './store-requisition-note.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreRequisitionNote } from './store-requisition-note.entity';
import { StoreRequisitionNoteStatus } from './store-requisition-note-status.enum';
import { User } from '../auth/user.entity';
import { UserRoles } from '../auth/user-roles.enum';

@Injectable()
export class StoreRequisitionNotesService {
    constructor(
        @InjectRepository(StoreRequisitionNoteRepository)
        private storeRequisitionNoteRepository: StoreRequisitionNoteRepository
    ) { }

    async getStoreRequisitionNotes(
        filterDto: GetStoreRequisitionNotesFilterDto,
        user: User
    ): Promise<StoreRequisitionNote[]> {
        return this.storeRequisitionNoteRepository.getStoreRequisitionNotes(filterDto, user);
    }

    async getStoreRequisitionNoteById(
        id: number,
        user: User,
        isUpdateRequest: boolean = false
    ): Promise<StoreRequisitionNote> {
        let found;

        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.SITE_ENGINEER,
            UserRoles.PROJECT_MANAGER,
            UserRoles.STORE_KEEPER
        ]

        if (isUpdateRequest || this.isRoleValid(user.role, allowedRoles)) {
            found = await this.storeRequisitionNoteRepository.findOne(id, { relations: ["items", "requestedBy", "storeRequisitionNoteItems"] });
        } else {
            await this.storeRequisitionNoteRepository.findOne({
                where: [
                    { id, requestedById: user.id },
                    { id, approvedById: user.id },
                ],
                relations: ["items", "storeRequisitionNoteItems"]
            });
        }

        if (!found) {
            throw new NotFoundException(`Store Requisition Note with ID ${id} not found`);
        } else {
            delete found.requestedBy.password;
        }

        return found;
    }

    async createStoreRequisitionNote(
        createStoreRequisitionNoteDto: CreateStoreRequisitionNoteDto,
        user: User
    ): Promise<StoreRequisitionNote> {
        return this.storeRequisitionNoteRepository.createStoreRequisitionNote(createStoreRequisitionNoteDto, user);
    }

    async deleteStoreRequisitionNote(id: number, user: User): Promise<void> {
        let result;
        if (user.role === UserRoles.ADMIN) {
            result = await this.storeRequisitionNoteRepository.delete(id);
        } else {
            throw new NotFoundException(`Store Requisition Note with ID ${id} not found`);
        }

        if (result && result.affected === 0) {
            throw new NotFoundException(`Store Requisition Note with ID ${id} not found`);
        }
    }

    async updateStoreRequisitionNoteStatus(id: number, status: StoreRequisitionNoteStatus, user: User): Promise<StoreRequisitionNote> {
        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.SITE_ENGINEER,
            UserRoles.PROJECT_MANAGER,
        ]

        const storeRequisitionNote = await this.getStoreRequisitionNoteById(id, user, true);

        if (storeRequisitionNote.status === StoreRequisitionNoteStatus.APPROVED) {
            throw new ConflictException(`Store Requisition Note with id ${id} already been approved`);
        } else if (!this.isRoleValid(user.role, allowedRoles)) {
            throw new UnauthorizedException();
        } else {
            storeRequisitionNote.status = status;
            storeRequisitionNote.approvedBy = user;
            storeRequisitionNote.approvedDate = new Date();
            await storeRequisitionNote.save();

            delete storeRequisitionNote.approvedBy;

            return storeRequisitionNote;
        }
    }

    async generateStoreRequisitionNoteNumber(): Promise<{}> {
        const [lastStoreRequisitionNote] = await this.storeRequisitionNoteRepository.find({
            order: { id: "DESC" },
            take: 1
        });

        let lastNumber = (lastStoreRequisitionNote) ? parseInt(lastStoreRequisitionNote.srnNo.replace(/^\D+/g, '')) : 0;
        let standardLastNumber = (lastNumber + 1).toString().padStart(3, '0');
        return { nextNumber: `srn-${standardLastNumber}` };
    }

    private isRoleValid(role: any, allowedRoles: UserRoles[]) {
        const idx = allowedRoles.indexOf(role);
        return idx !== -1;
    }
}
