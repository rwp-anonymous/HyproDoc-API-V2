import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { GoodsReceivedNotesService } from './goods-received-notes.service';
import { GetGoodsReceivedNotesFilterDto } from './dto/get-goods-received-notes-filter.dto';
import { CreateGoodsReceivedNoteDto } from './dto/create-goods-received-note.dto';
import { GoodsReceivedNote } from './goods-received-note.entity';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { StoreLocationValidationPipe } from '../items/pipes/store-location-validation.pipe';
import { StoreLocations } from '../items/store-location.enum';

@ApiUseTags('Goods Received Notes')
@ApiBearerAuth()
@Controller('grns')
@UseGuards(AuthGuard())
export class GoodsReceivedNotesController {
    private logger = new Logger('GoodsReceivedNotesController');

    constructor(private goodsReceivedNotesService: GoodsReceivedNotesService) { }

    @Get()
    getGoodsReceivedNotes(
        @Query(ValidationPipe) filterDto: GetGoodsReceivedNotesFilterDto,
        @GetUser() user: User
    ): Promise<GoodsReceivedNote[]> {
        this.logger.verbose(`User "${user.email}" retriving all goods received notes. Filters: ${JSON.stringify(filterDto)}`)
        return this.goodsReceivedNotesService.getGoodsReceivedNotes(filterDto, user);
    }

    @Get('/nextNumber')
    generateGoodsReceivedNoteNumber(): Promise<{}> {
        return this.goodsReceivedNotesService.generateGoodsReceivedNoteNumber();
    }

    @Get('/:id')
    getGoodsReceivedNoteById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<GoodsReceivedNote> {
        return this.goodsReceivedNotesService.getGoodsReceivedNoteById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createGoodsReceivedNote(
        @Body() createGoodsReceivedNoteDto: CreateGoodsReceivedNoteDto,
        @Body('siteLocation', StoreLocationValidationPipe) storeLocation: StoreLocations,
        @GetUser() user: User
    ): Promise<GoodsReceivedNote> {
        this.logger.verbose(`User "${user.email}" creating a new goods received note. Data: ${JSON.stringify(createGoodsReceivedNoteDto)}`)
        return this.goodsReceivedNotesService.createGoodsReceivedNote(createGoodsReceivedNoteDto, user);
    }

    @Delete('/:id')
    deleteGoodsReceivedNote(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.goodsReceivedNotesService.deleteGoodsReceivedNote(id, user);
    }
}
