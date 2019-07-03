import { Controller } from '@nestjs/common';
import { MaterialRequisitionNotesService } from 'dist/material-requisition-notes/material-requisition-notes.service';

@Controller('material-requisition-notes')
export class MaterialRequisitionNotesController {
    constructor(private materialRequisitionNotesService: MaterialRequisitionNotesService) { }
}
