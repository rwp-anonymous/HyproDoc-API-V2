import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaterialRequisitionNoteDto } from './dto/create-material-requisition-note.dto';
import { GetMaterialRequisitionNotesFilterDto } from './dto/get-material-requisition-notes-filter.dto';
import { MaterialRequisitionNoteRepository } from './material-requisition-note.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialRequisitionNote } from './material-requisition-note.entity';
import { MaterialRequisitionNoteStatus } from './material-requisition-note-status.enum';

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

    async createMaterialRequisitionNote(createMaterialRequisitionNoteDto: CreateMaterialRequisitionNoteDto): Promise<MaterialRequisitionNote> {
        return this.materialRequisitionNoteRepository.createMaterialRequisitionNote(createMaterialRequisitionNoteDto);
    }

    async deleteMaterialRequisitionNote(id: number): Promise<void> {
        const result = await this.materialRequisitionNoteRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Material Requisition Note with ID ${id} not found`);
        }
    }

    async updateMaterialRequisitionNoteStatus(id: number, status: MaterialRequisitionNoteStatus): Promise<MaterialRequisitionNote> {
        const materialRequisitionNote = await this.getMaterialRequisitionNoteById(id);
        materialRequisitionNote.status = status;
        await materialRequisitionNote.save();
        return materialRequisitionNote;
    }
}
