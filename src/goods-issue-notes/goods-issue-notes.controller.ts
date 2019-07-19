import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { GoodsIssueNotesService } from './goods-issue-notes.service';
import { CreateGoodsIssueNoteDto } from './dto/create-goods-issue-note.dto';
import { GetGoodsIssueNotesFilterDto } from './dto/get-goods-issue-notes-filter.dto';
import { GoodsIssueNoteStatusValidationPipe } from './pipes/goods-issue-note-status-validation.pipe';
import { GoodsIssueNote } from './goods-issue-note.entity';
import { GoodsIssueNoteStatus } from './goods-issue-note-status.enum';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { StoreLocationValidationPipe } from '../items/pipes/store-location-validation.pipe';
import { StoreLocations } from '../items/store-location.enum';

@ApiUseTags('Goods Issue Notes')
@ApiBearerAuth()
@Controller('gins')
@UseGuards(AuthGuard())
export class GoodsIssueNotesController {
    private logger = new Logger('GoodsIssueNotesController');

    constructor(private goodsIssueNotesService: GoodsIssueNotesService) { }

    @Get()
    getGoodsIssueNotes(
        @Query(ValidationPipe) filterDto: GetGoodsIssueNotesFilterDto,
        @GetUser() user: User
    ): Promise<GoodsIssueNote[]> {
        this.logger.verbose(`User "${user.email}" retriving all goods issue notes. Filters: ${JSON.stringify(filterDto)}`)
        return this.goodsIssueNotesService.getGoodsIssueNotes(filterDto, user);
    }

    @Get('/nextNumber')
    generateGoodsIssueNoteNumber(): Promise<{}> {
        return this.goodsIssueNotesService.generateGoodsIssueNoteNumber();
    }

    @Get('/:id')
    getGoodsIssueNoteById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<GoodsIssueNote> {
        return this.goodsIssueNotesService.getGoodsIssueNoteById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createGoodsIssueNote(
        @Body() createGoodsIssueNoteDto: CreateGoodsIssueNoteDto,
        @Body('siteLocation', StoreLocationValidationPipe) storeLocation: StoreLocations,
        @GetUser() user: User
    ): Promise<GoodsIssueNote> {
        this.logger.verbose(`User "${user.email}" creating a new goods issue note. Data: ${JSON.stringify(createGoodsIssueNoteDto)}`)
        return this.goodsIssueNotesService.createGoodsIssueNote(createGoodsIssueNoteDto, user);
    }

    @Delete('/:id')
    deleteGoodsIssueNote(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.goodsIssueNotesService.deleteGoodsIssueNote(id, user);
    }

    @Patch('/:id/status')
    updateGoodsIssueNoteStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', GoodsIssueNoteStatusValidationPipe) status: GoodsIssueNoteStatus,
        @GetUser() user: User
    ): Promise<GoodsIssueNote> {
        return this.goodsIssueNotesService.updateGoodsIssueNoteStatus(id, status, user);
    }
}
