import { Controller, Get } from '@nestjs/common';
import { MaterialRequisitionNotesService } from './material-requisition-notes.service';

@Controller('mrns')
export class MaterialRequisitionNotesController {
    constructor(private materialRequisitionNotesService: MaterialRequisitionNotesService) { }

    @Get()
    getAllMaterialRequisitionNotes() {
        return this.materialRequisitionNotesService.getAllMaterialRequisitionNotes();
    }
}
