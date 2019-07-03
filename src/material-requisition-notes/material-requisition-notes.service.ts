import { Injectable } from '@nestjs/common';
import { MaterialRequisitionNote, Item, MaterialRequisitionNoteStatus } from './material-requisition-note.model';
import * as uuid from 'uuid/v1'

@Injectable()
export class MaterialRequisitionNotesService {
    private materialRequisitionNotes: MaterialRequisitionNote[] = [];

    getAllMaterialRequisitionNotes(): MaterialRequisitionNote[] {
        return this.materialRequisitionNotes;
    }

    createMaterialRequisitionNote(mrnNo: string, siteLocation: string, requestDate: Date, requestedBy: string, approvedBy: string, items: Item[]): MaterialRequisitionNote {
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
}
