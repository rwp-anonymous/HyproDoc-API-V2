import { Controller, UseGuards, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StoreRequisitionNoteItemsService } from './store-requisition-note-items.service';
import { CreateStoreRequisitionNoteItemDto } from './dto/create-store-requisition-note-item.dto';
import { ItemUnitValidationPipe } from '../items/pipes/item-unit-validation.pipe';
import { ItemUnits } from '../items/item-units.enum';
import { StoreRequisitionNoteItem } from './store-requisition-note-item.entity';

@ApiUseTags('Store Requisition Note Items')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('store-requisition-note-items')
export class StoreRequisitionNoteItemsController {
    constructor(private itemsService: StoreRequisitionNoteItemsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    createItem(
        @Body() createItemDto: CreateStoreRequisitionNoteItemDto,
        @Body('unit', ItemUnitValidationPipe) unit: ItemUnits
    ): Promise<StoreRequisitionNoteItem> {
        return this.itemsService.createItem(createItemDto);
    }
}
