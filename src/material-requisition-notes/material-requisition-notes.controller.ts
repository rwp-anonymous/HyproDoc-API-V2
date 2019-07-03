import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { MaterialRequisitionNotesService } from './material-requisition-notes.service';
import { MaterialRequisitionNote, Item, MaterialRequisitionNoteStatus } from './material-requisition-note.model';
import { CreateMaterialRequisitionNoteDto } from './dto/create-material-requisition-note.dto';
import { GetMaterialRequisitionNotesFilterDto } from './dto/get-material-requisition-notes-filter.dto';

@Controller('mrns')
export class MaterialRequisitionNotesController {
    constructor(private materialRequisitionNotesService: MaterialRequisitionNotesService) { }

    @Get()
    getMaterialRequisitionNotes(@Query() filterDto: GetMaterialRequisitionNotesFilterDto): MaterialRequisitionNote[] {
        if (Object.keys(filterDto).length) {
            return this.materialRequisitionNotesService.getMaterialRequisitionNotesWithFilters(filterDto);
        }
        return this.materialRequisitionNotesService.getAllMaterialRequisitionNotes();
    }

    @Get('/:id')
    getMaterialRequisitionNoteById(@Param('id') id: string): MaterialRequisitionNote {
        return this.materialRequisitionNotesService.getMaterialRequisitionNoteById(id);
    }

    @Post()
    createMaterialRequisitionNote(@Body() createMaterialRequisitionNoteDto: CreateMaterialRequisitionNoteDto): MaterialRequisitionNote {
        return this.materialRequisitionNotesService.createMaterialRequisitionNote(createMaterialRequisitionNoteDto);
    }

    @Delete('/:id')
    deleteMaterialRequisitionNote(@Param('id') id: string): void {
        this.materialRequisitionNotesService.deleteMaterialRequisitionNote(id);
    }

    @Patch('/:id/status')
    updateMaterialRequisitionNoteStatus(@Param('id') id: string, @Body('status') status: MaterialRequisitionNoteStatus): MaterialRequisitionNote {
        return this.materialRequisitionNotesService.updateMaterialRequisitionNoteStatus(id, status);
    }
}
