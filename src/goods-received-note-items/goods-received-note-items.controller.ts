import { Controller, UseGuards, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { GoodsReceivedNoteItemsService } from './goods-received-note-items.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateGoodsReceivedNoteItemDto } from './dto/create-goods-received-note-item.dto';
import { ItemUnitValidationPipe } from '../items/pipes/item-unit-validation.pipe';
import { ItemUnits } from '../items/item-units.enum';
import { GoodsReceivedNoteItem } from './goods-received-note-item.entity';

@ApiUseTags('Goods Received Note Items')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('goods-received-note-items')
export class GoodsReceivedNoteItemsController {
    constructor(private itemsService: GoodsReceivedNoteItemsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    createItem(
        @Body() createItemDto: CreateGoodsReceivedNoteItemDto,
        @Body('unit', ItemUnitValidationPipe) unit: ItemUnits
    ): Promise<GoodsReceivedNoteItem> {
        return this.itemsService.createItem(createItemDto);
    }
}
