import { Injectable } from '@nestjs/common';
import { MaterialRequisitionNote, Item, MaterialRequisitionNoteStatus } from './material-requisition-note.model';
import * as uuid from 'uuid/v1'
import { CreateMaterialRequisitionNoteDto } from './dto/create-material-requisition-note.dto';
import { GetMaterialRequisitionNotesFilterDto } from './dto/get-material-requisition-notes-filter.dto';

@Injectable()
export class MaterialRequisitionNotesService {
    private materialRequisitionNotes: MaterialRequisitionNote[] = [];

    getAllMaterialRequisitionNotes(): MaterialRequisitionNote[] {
        return this.materialRequisitionNotes;
    }

    getMaterialRequisitionNotesWithFilters(filterDto: GetMaterialRequisitionNotesFilterDto): MaterialRequisitionNote[] {
        const { status, search } = filterDto;

        let materialRequisitionNotes = this.getAllMaterialRequisitionNotes();

        if (status) {
            materialRequisitionNotes = materialRequisitionNotes.filter(materialRequisitionNote => materialRequisitionNote.status === status);
        }

        if (search) {
            materialRequisitionNotes = materialRequisitionNotes.filter(materialRequisitionNote =>
                materialRequisitionNote.mrnNo.includes(search) ||
                materialRequisitionNote.requestedBy.includes(search) ||
                materialRequisitionNote.approvedBy.includes(search) ||
                materialRequisitionNote.siteLocation.includes(search)
            )
        }

        return materialRequisitionNotes;
    }

    getMaterialRequisitionNoteById(id: string): MaterialRequisitionNote {
        return this.materialRequisitionNotes.find(materialRequisitionNote => materialRequisitionNote.id === id);
    }

    createMaterialRequisitionNote(createMaterialRequisitionNoteDto: CreateMaterialRequisitionNoteDto): MaterialRequisitionNote {
        const { mrnNo, siteLocation, requestDate, requestedBy, approvedBy, items } = createMaterialRequisitionNoteDto;

        const materialRequisitionNote: MaterialRequisitionNote = {
            id: uuid(),
            mrnNo,
            siteLocation,
            requestDate,
            requestedBy,
            approvedBy,
            items,
            status: MaterialRequisitionNoteStatus.OPEN
        }

        this.materialRequisitionNotes.push(materialRequisitionNote);
        return materialRequisitionNote;
    }

    deleteMaterialRequisitionNote(id: string): void {
        this.materialRequisitionNotes = this.materialRequisitionNotes.filter(materialRequisitionNote => materialRequisitionNote.id !== id);
    }

    updateMaterialRequisitionNoteStatus(id: string, status: MaterialRequisitionNoteStatus): MaterialRequisitionNote {
        const materialRequisitionNote = this.getMaterialRequisitionNoteById(id);
        materialRequisitionNote.status = status;
        return materialRequisitionNote;
    }
}
