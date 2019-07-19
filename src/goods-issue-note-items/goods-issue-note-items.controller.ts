import { Controller, UseGuards, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { GoodsIssueNoteItemsService } from './goods-issue-note-items.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateGoodsIssueNoteItemDto } from './dto/create-goods-issue-note-item.dto';
import { ItemUnitValidationPipe } from '../items/pipes/item-unit-validation.pipe';
import { ItemUnits } from '../items/item-units.enum';
import { GoodsIssueNoteItem } from './goods-issue-note-item.entity';

@ApiUseTags('Goods Issue Note Items')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('goods-issue-note-items')
export class GoodsIssueNoteItemsController {
    constructor(private itemsService: GoodsIssueNoteItemsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    createItem(
        @Body() createItemDto: CreateGoodsIssueNoteItemDto,
        @Body('unit', ItemUnitValidationPipe) unit: ItemUnits
    ): Promise<GoodsIssueNoteItem> {
        return this.itemsService.createItem(createItemDto);
    }
}
