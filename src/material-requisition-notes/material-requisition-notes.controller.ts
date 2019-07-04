import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { MaterialRequisitionNotesService } from './material-requisition-notes.service';
import { CreateMaterialRequisitionNoteDto } from './dto/create-material-requisition-note.dto';
import { GetMaterialRequisitionNotesFilterDto } from './dto/get-material-requisition-notes-filter.dto';
import { MaterialRequisitionNoteStatusValidationPipe } from './pipes/material-requisition-note-status-validation.pipe';
import { MaterialRequisitionNote } from './material-requisition-note.entity';
import { MaterialRequisitionNoteStatus } from './material-requisition-note-status.enum';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('Material Requisition Notes')
@Controller('mrns')
export class MaterialRequisitionNotesController {
    constructor(private materialRequisitionNotesService: MaterialRequisitionNotesService) { }

    @Get()
    getMaterialRequisitionNotes(@Query(ValidationPipe) filterDto: GetMaterialRequisitionNotesFilterDto): Promise<MaterialRequisitionNote[]> {
        return this.materialRequisitionNotesService.getMaterialRequisitionNotes(filterDto);
    }

    @Get('/:id')
    getMaterialRequisitionNoteById(@Param('id', ParseIntPipe) id: number): Promise<MaterialRequisitionNote> {
        return this.materialRequisitionNotesService.getMaterialRequisitionNoteById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createMaterialRequisitionNote(@Body() createMaterialRequisitionNoteDto: CreateMaterialRequisitionNoteDto): Promise<MaterialRequisitionNote> {
        return this.materialRequisitionNotesService.createMaterialRequisitionNote(createMaterialRequisitionNoteDto);
    }

    @Delete('/:id')
    deleteMaterialRequisitionNote(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.materialRequisitionNotesService.deleteMaterialRequisitionNote(id);
    }

    @Patch('/:id/status')
    updateMaterialRequisitionNoteStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', MaterialRequisitionNoteStatusValidationPipe) status: MaterialRequisitionNoteStatus
    ): Promise<MaterialRequisitionNote> {
        return this.materialRequisitionNotesService.updateMaterialRequisitionNoteStatus(id, status);
    }
}
