import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MaterialRequisitionNotesService } from './material-requisition-notes.service';
import { CreateMaterialRequisitionNoteDto } from './dto/create-material-requisition-note.dto';
import { GetMaterialRequisitionNotesFilterDto } from './dto/get-material-requisition-notes-filter.dto';
import { MaterialRequisitionNoteStatusValidationPipe } from './pipes/material-requisition-note-status-validation.pipe';
import { MaterialRequisitionNote } from './material-requisition-note.entity';
import { MaterialRequisitionNoteStatus } from './material-requisition-note-status.enum';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@ApiUseTags('Material Requisition Notes')
@ApiBearerAuth()
@Controller('mrns')
@UseGuards(AuthGuard())
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
    createMaterialRequisitionNote(
        @Body() createMaterialRequisitionNoteDto: CreateMaterialRequisitionNoteDto,
        @GetUser() user: User
    ): Promise<MaterialRequisitionNote> {
        return this.materialRequisitionNotesService.createMaterialRequisitionNote(createMaterialRequisitionNoteDto, user);
    }

    @Delete('/:id')
    deleteMaterialRequisitionNote(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.materialRequisitionNotesService.deleteMaterialRequisitionNote(id);
    }

    @Patch('/:id/status')
    updateMaterialRequisitionNoteStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', MaterialRequisitionNoteStatusValidationPipe) status: MaterialRequisitionNoteStatus,
        @GetUser() user: User
    ): Promise<MaterialRequisitionNote> {
        return this.materialRequisitionNotesService.updateMaterialRequisitionNoteStatus(id, status, user);
    }
}
