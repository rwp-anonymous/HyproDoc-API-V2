import { Injectable } from '@nestjs/common';

@Injectable()
export class MaterialRequisitionNotesService {
    private materialRequisitionNotes = [];

    getAllMaterialRequisitionNotes() {
        return this.materialRequisitionNotes;
    }
}
