import { Controller, UseGuards, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { MaterialRequisitionNoteItemsService } from './material-requisition-note-items.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateMaterialRequisitionNoteItemDto } from './dto/create-material-requisition-note-item.dto';
import { ItemUnitValidationPipe } from '../items/pipes/item-unit-validation.pipe';
import { ItemUnits } from '../items/item-units.enum';
import { MaterialRequisitionNoteItem } from './material-requisition-note-item.entity';

@ApiUseTags('Material Requisition Note Items')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('material-requisition-note-items')
export class MaterialRequisitionNoteItemsController {
    constructor(private itemsService: MaterialRequisitionNoteItemsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    createItem(
        @Body() createItemDto: CreateMaterialRequisitionNoteItemDto,
        @Body('unit', ItemUnitValidationPipe) unit: ItemUnits
    ): Promise<MaterialRequisitionNoteItem> {
        return this.itemsService.createItem(createItemDto);
    }
}
