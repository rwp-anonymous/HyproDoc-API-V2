import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateMaterialRequisitionNoteDto } from './dto/create-material-requisition-note.dto';
import { GetMaterialRequisitionNotesFilterDto } from './dto/get-material-requisition-notes-filter.dto';
import { MaterialRequisitionNoteRepository } from './material-requisition-note.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialRequisitionNote } from './material-requisition-note.entity';
import { MaterialRequisitionNoteStatus } from './material-requisition-note-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class MaterialRequisitionNotesService {
    constructor(
        @InjectRepository(MaterialRequisitionNoteRepository)
        private materialRequisitionNoteRepository: MaterialRequisitionNoteRepository
    ) { }

    async getMaterialRequisitionNotes(filterDto: GetMaterialRequisitionNotesFilterDto): Promise<MaterialRequisitionNote[]> {
        return this.materialRequisitionNoteRepository.getMaterialRequisitionNotes(filterDto);
    }

    async getMaterialRequisitionNoteById(id: number): Promise<MaterialRequisitionNote> {
        const found = await this.materialRequisitionNoteRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Material Requisition Note with ID ${id} not found`);
        }

        return found;
    }

    async createMaterialRequisitionNote(
        createMaterialRequisitionNoteDto: CreateMaterialRequisitionNoteDto,
        user: User
    ): Promise<MaterialRequisitionNote> {
        return this.materialRequisitionNoteRepository.createMaterialRequisitionNote(createMaterialRequisitionNoteDto, user);
    }

    async deleteMaterialRequisitionNote(id: number): Promise<void> {
        const result = await this.materialRequisitionNoteRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Material Requisition Note with ID ${id} not found`);
        }
    }

    async updateMaterialRequisitionNoteStatus(id: number, status: MaterialRequisitionNoteStatus, user: User): Promise<MaterialRequisitionNote> {
        const materialRequisitionNote = await this.getMaterialRequisitionNoteById(id);

        if (materialRequisitionNote.status === MaterialRequisitionNoteStatus.APPROVED) {
            throw new ConflictException(`Material Requisition Note with id ${id} already been approved`);
        }
        materialRequisitionNote.status = status;
        materialRequisitionNote.approvedBy = user;
        materialRequisitionNote.approvedDate = new Date();
        await materialRequisitionNote.save();

        delete materialRequisitionNote.approvedBy;

        return materialRequisitionNote;
    }
}
