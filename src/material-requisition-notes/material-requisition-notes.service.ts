import { Injectable } from '@nestjs/common';
import { MaterialRequisitionNote } from './material-requisition-note.model';

@Injectable()
export class MaterialRequisitionNotesService {
    private materialRequisitionNotes: MaterialRequisitionNote[] = [];

    getAllMaterialRequisitionNotes(): MaterialRequisitionNote[] {
        return this.materialRequisitionNotes;
    }
}
