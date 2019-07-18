import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { StoreRequisitionNotesService } from './store-requisition-notes.service';
import { CreateStoreRequisitionNoteDto } from './dto/create-store-requisition-note.dto';
import { GetStoreRequisitionNotesFilterDto } from './dto/get-store-requisition-notes-filter.dto';
import { StoreRequisitionNoteStatusValidationPipe } from './pipes/store-requisition-note-status-validation.pipe';
import { StoreRequisitionNote } from './store-requisition-note.entity';
import { StoreRequisitionNoteStatus } from './store-requisition-note-status.enum';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { StoreLocationValidationPipe } from '../items/pipes/store-location-validation.pipe';
import { StoreLocations } from '../items/store-location.enum';

@ApiUseTags('Store Requisition Notes')
@ApiBearerAuth()
@Controller('srns')
@UseGuards(AuthGuard())
export class StoreRequisitionNotesController {
    private logger = new Logger('StoreRequisitionNotesController');

    constructor(private storeRequisitionNotesService: StoreRequisitionNotesService) { }

    @Get()
    getStoreRequisitionNotes(
        @Query(ValidationPipe) filterDto: GetStoreRequisitionNotesFilterDto,
        @GetUser() user: User
    ): Promise<StoreRequisitionNote[]> {
        this.logger.verbose(`User "${user.email}" retriving all store requisition notes. Filters: ${JSON.stringify(filterDto)}`)
        return this.storeRequisitionNotesService.getStoreRequisitionNotes(filterDto, user);
    }

    @Get('/nextNumber')
    generateStoreRequisitionNoteNumber(): Promise<{}> {
        return this.storeRequisitionNotesService.generateStoreRequisitionNoteNumber();
    }

    @Get('/:id')
    getStoreRequisitionNoteById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<StoreRequisitionNote> {
        return this.storeRequisitionNotesService.getStoreRequisitionNoteById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createMaterialRequisitionNote(
        @Body() createStoreRequisitionNoteDto: CreateStoreRequisitionNoteDto,
        @Body('siteLocation', StoreLocationValidationPipe) storeLocation: StoreLocations,
        @GetUser() user: User
    ): Promise<StoreRequisitionNote> {
        this.logger.verbose(`User "${user.email}" creating a new material requisition note. Data: ${JSON.stringify(createStoreRequisitionNoteDto)}`)
        return this.storeRequisitionNotesService.createStoreRequisitionNote(createStoreRequisitionNoteDto, user);
    }

    @Delete('/:id')
    deleteMaterialRequisitionNote(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.storeRequisitionNotesService.deleteStoreRequisitionNote(id, user);
    }

    @Patch('/:id/status')
    updateStoreRequisitionNoteStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', StoreRequisitionNoteStatusValidationPipe) status: StoreRequisitionNoteStatus,
        @GetUser() user: User
    ): Promise<StoreRequisitionNote> {
        return this.storeRequisitionNotesService.updateStoreRequisitionNoteStatus(id, status, user);
    }
}
