import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
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
import { StoreLocationValidationPipe } from '../items/pipes/store-location-validation.pipe';
import { StoreLocations } from '../items/store-location.enum';

@ApiUseTags('Material Requisition Notes')
@ApiBearerAuth()
@Controller('mrns')
@UseGuards(AuthGuard())
export class MaterialRequisitionNotesController {
    private logger = new Logger('MaterialRequisitionNotesController');

    constructor(private materialRequisitionNotesService: MaterialRequisitionNotesService) { }

    @Get()
    getMaterialRequisitionNotes(
        @Query(ValidationPipe) filterDto: GetMaterialRequisitionNotesFilterDto,
        @GetUser() user: User
    ): Promise<MaterialRequisitionNote[]> {
        this.logger.verbose(`User "${user.email}" retriving all material requisition notes. Filters: ${JSON.stringify(filterDto)}`)
        return this.materialRequisitionNotesService.getMaterialRequisitionNotes(filterDto, user);
    }

    @Get('/nextNumber')
    generateMaterialRequisitionNoteNumber(): Promise<{}> {
        return this.materialRequisitionNotesService.generateMaterialRequisitionNoteNumber();
    }

    @Get('/:id')
    getMaterialRequisitionNoteById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<MaterialRequisitionNote> {
        return this.materialRequisitionNotesService.getMaterialRequisitionNoteById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createMaterialRequisitionNote(
        @Body() createMaterialRequisitionNoteDto: CreateMaterialRequisitionNoteDto,
        @Body('siteLocation', StoreLocationValidationPipe) storeLocation: StoreLocations,
        @GetUser() user: User
    ): Promise<MaterialRequisitionNote> {
        this.logger.verbose(`User "${user.email}" creating a new material requisition note. Data: ${JSON.stringify(createMaterialRequisitionNoteDto)}`)
        return this.materialRequisitionNotesService.createMaterialRequisitionNote(createMaterialRequisitionNoteDto, user);
    }

    @Delete('/:id')
    deleteMaterialRequisitionNote(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.materialRequisitionNotesService.deleteMaterialRequisitionNote(id, user);
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
