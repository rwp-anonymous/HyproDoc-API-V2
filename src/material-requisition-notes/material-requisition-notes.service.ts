import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateMaterialRequisitionNoteDto } from './dto/create-material-requisition-note.dto';
import { GetMaterialRequisitionNotesFilterDto } from './dto/get-material-requisition-notes-filter.dto';
import { MaterialRequisitionNoteRepository } from './material-requisition-note.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialRequisitionNote } from './material-requisition-note.entity';
import { MaterialRequisitionNoteStatus } from './material-requisition-note-status.enum';
import { User } from '../auth/user.entity';
import { UserRoles } from '../auth/user-roles.enum';

@Injectable()
export class MaterialRequisitionNotesService {
    constructor(
        @InjectRepository(MaterialRequisitionNoteRepository)
        private materialRequisitionNoteRepository: MaterialRequisitionNoteRepository
    ) { }

    async getMaterialRequisitionNotes(
        filterDto: GetMaterialRequisitionNotesFilterDto,
        user: User
    ): Promise<MaterialRequisitionNote[]> {
        return this.materialRequisitionNoteRepository.getMaterialRequisitionNotes(filterDto, user);
    }

    async getMaterialRequisitionNoteById(
        id: number,
        user: User,
        isUpdateRequest: boolean = false
    ): Promise<MaterialRequisitionNote> {
        let found;

        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.SITE_ENGINEER,
            UserRoles.FOREMAN
        ]

        if (isUpdateRequest || this.isRoleValid(user.role, allowedRoles)) {
            found = await this.materialRequisitionNoteRepository.findOne(id, { relations: ["items", "requestedBy", "materialRequisitionNoteItems"] });
        } else {
            await this.materialRequisitionNoteRepository.findOne({
                where: [
                    { id, requestedById: user.id },
                    { id, approvedById: user.id },
                ],
                relations: ["items", "materialRequisitionNoteItems"]
            });
        }

        if (!found) {
            throw new NotFoundException(`Material Requisition Note with ID ${id} not found`);
        } else {
            delete found.requestedBy.password;
        }

        return found;
    }

    async createMaterialRequisitionNote(
        createMaterialRequisitionNoteDto: CreateMaterialRequisitionNoteDto,
        user: User
    ): Promise<MaterialRequisitionNote> {
        return this.materialRequisitionNoteRepository.createMaterialRequisitionNote(createMaterialRequisitionNoteDto, user);
    }

    async deleteMaterialRequisitionNote(id: number, user: User): Promise<void> {
        let result;
        if (user.role === UserRoles.ADMIN) {
            result = await this.materialRequisitionNoteRepository.delete(id);
        } else {
            throw new NotFoundException(`Material Requisition Note with ID ${id} not found`);
        }

        if (result && result.affected === 0) {
            throw new NotFoundException(`Material Requisition Note with ID ${id} not found`);
        }
    }

    async updateMaterialRequisitionNoteStatus(id: number, status: MaterialRequisitionNoteStatus, user: User): Promise<MaterialRequisitionNote> {
        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.SITE_ENGINEER,
        ]

        const materialRequisitionNote = await this.getMaterialRequisitionNoteById(id, user, true);

        if (materialRequisitionNote.status === MaterialRequisitionNoteStatus.APPROVED) {
            throw new ConflictException(`Material Requisition Note with id ${id} already been approved`);
        } else if (!this.isRoleValid(user.role, allowedRoles)) {
            throw new UnauthorizedException();
        } else {
            materialRequisitionNote.status = status;
            materialRequisitionNote.approvedBy = user;
            materialRequisitionNote.approvedDate = new Date();
            await materialRequisitionNote.save();

            delete materialRequisitionNote.approvedBy;

            return materialRequisitionNote;
        }
    }

    async generateMaterialRequisitionNoteNumber(): Promise<{}> {
        const [lastMaterialRequisitionNote] = await this.materialRequisitionNoteRepository.find({
            order: { id: "DESC" },
            take: 1
        });

        let lastNumber = (lastMaterialRequisitionNote) ? parseInt(lastMaterialRequisitionNote.mrnNo.replace(/^\D+/g, '')) : 0;
        let standardLastNumber = (lastNumber + 1).toString().padStart(3, '0');
        return { nextNumber: `mrn-${standardLastNumber}` };
    }

    private isRoleValid(role: any, allowedRoles: UserRoles[]) {
        const idx = allowedRoles.indexOf(role);
        return idx !== -1;
    }
}
