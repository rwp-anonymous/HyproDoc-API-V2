import { Controller, Get, Post, Body } from '@nestjs/common';
import { MaterialRequisitionNotesService } from './material-requisition-notes.service';
import { MaterialRequisitionNote, Item } from './material-requisition-note.model';

@Controller('mrns')
export class MaterialRequisitionNotesController {
    constructor(private materialRequisitionNotesService: MaterialRequisitionNotesService) { }

    @Get()
    getAllMaterialRequisitionNotes(): MaterialRequisitionNote[] {
        return this.materialRequisitionNotesService.getAllMaterialRequisitionNotes();
    }

    @Post()
    createMaterialRequisitionNote(
        @Body('mrnNo') mrnNo: string,
        @Body('siteLocation') siteLocation: string,
        @Body('requestDate') requestDate: Date,
        @Body('requestedBy') requestedBy: string,
        @Body('approvedBy') approvedBy: string,
        @Body('items') items: Item[],

    ): MaterialRequisitionNote {
        return this.materialRequisitionNotesService.createMaterialRequisitionNote(mrnNo, siteLocation, requestDate, requestedBy, approvedBy, items);
    }
}
