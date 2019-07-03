import { Injectable } from '@nestjs/common';
import { MaterialRequisitionNote, Item, MaterialRequisitionNoteStatus } from './material-requisition-note.model';
import * as uuid from 'uuid/v1'
import { CreateMaterialRequisitionNoteDto } from './dto/create-material-requisition-note.dto';

@Injectable()
export class MaterialRequisitionNotesService {
    private materialRequisitionNotes: MaterialRequisitionNote[] = [];

    getAllMaterialRequisitionNotes(): MaterialRequisitionNote[] {
        return this.materialRequisitionNotes;
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
}
