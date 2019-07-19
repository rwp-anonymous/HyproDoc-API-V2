import { Controller, UseGuards, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { PurchaseOrderItemsService } from './purchase-order-items.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreatePurchaseOrderItemDto } from './dto/create-purchase-order-item.dto';
import { ItemUnitValidationPipe } from '../items/pipes/item-unit-validation.pipe';
import { ItemUnits } from '../items/item-units.enum';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@ApiUseTags('Purchase Order Items')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('purchase-order-items')
export class PurchaseOrderItemsController {
    constructor(private itemsService: PurchaseOrderItemsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    createItem(
        @Body() createItemDto: CreatePurchaseOrderItemDto,
        @Body('unit', ItemUnitValidationPipe) unit: ItemUnits
    ): Promise<PurchaseOrderItem> {
        return this.itemsService.createItem(createItemDto);
    }
}
