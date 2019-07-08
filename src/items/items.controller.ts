import { Controller, UseGuards, Get, Query, ValidationPipe, Param, ParseIntPipe, Post, UsePipes, Body, Delete, Patch } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ItemsService } from './items.service';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemUnitValidationPipe } from './pipes/item-unit-validation.pipe';
import { ItemUnits } from './item-units.enum';
import { StoreLocationValidationPipe } from './pipes/store-location-validation.pipe';
import { StoreLocations } from './store-location.enum';

@ApiUseTags('Items')
@ApiBearerAuth()
@Controller('items')
@UseGuards(AuthGuard())
export class ItemsController {
    constructor(private itemsService: ItemsService) { }

    @Get()
    getItems(
        @Query(ValidationPipe) filterDto: GetItemsFilterDto,
        @GetUser() user: User
    ): Promise<Item[]> {
        return this.itemsService.getItems(filterDto, user);
    }

    @Get('/:id')
    getItemById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Item> {
        return this.itemsService.getItemById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createItem(
        @Body() createItemDto: CreateItemDto,
        @Body('unit', ItemUnitValidationPipe) unit: ItemUnits,
        @Body('storeLocation', StoreLocationValidationPipe) storeLocation: StoreLocations,
        @GetUser() user: User
    ): Promise<Item> {
        return this.itemsService.createItem(createItemDto, user);
    }

    @Delete('/:id')
    deleteItem(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.itemsService.deleteItem(id, user);
    }

    @Patch('/:id/quantity')
    updateItemQuantity(
        @Param('id', ParseIntPipe) id: number,
        @Body('quantity') quantity: number,
        @GetUser() user: User
    ): Promise<Item> {
        return this.itemsService.updateItemQuantity(id, quantity, user);
    }
}
