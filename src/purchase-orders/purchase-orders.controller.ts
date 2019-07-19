import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { GetPurchaseOrdersFilterDto } from './dto/get-purchase-notes-filter.dto';
import { PurchaseOrderStatusValidationPipe } from './pipes/purchase-order-status-validation.pipe';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderStatus } from './purchase-order-status.enum';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { StoreLocationValidationPipe } from '../items/pipes/store-location-validation.pipe';
import { StoreLocations } from '../items/store-location.enum';

@ApiUseTags('Purchase Orders')
@ApiBearerAuth()
@Controller('pos')
@UseGuards(AuthGuard())
export class PurchaseOrdersController {
    private logger = new Logger('PurchaseOrdersController');

    constructor(private purchaseOrdersService: PurchaseOrdersService) { }

    @Get()
    getPurchaseOrders(
        @Query(ValidationPipe) filterDto: GetPurchaseOrdersFilterDto,
        @GetUser() user: User
    ): Promise<PurchaseOrder[]> {
        this.logger.verbose(`User "${user.email}" retriving all purchase orders. Filters: ${JSON.stringify(filterDto)}`)
        return this.purchaseOrdersService.getPurchaseOrders(filterDto, user);
    }

    @Get('/nextNumber')
    generatePurchaseOrderNumber(): Promise<{}> {
        return this.purchaseOrdersService.generatePurchaseOrderNumber();
    }

    @Get('/:id')
    getPurchaseOrdersById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<PurchaseOrder> {
        return this.purchaseOrdersService.getPurchaseOrderById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createPurchaseOrders(
        @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
        @Body('siteLocation', StoreLocationValidationPipe) storeLocation: StoreLocations,
        @GetUser() user: User
    ): Promise<PurchaseOrder> {
        this.logger.verbose(`User "${user.email}" creating a new purchase order. Data: ${JSON.stringify(createPurchaseOrderDto)}`)
        return this.purchaseOrdersService.createPurchaseOrder(createPurchaseOrderDto, user);
    }

    @Delete('/:id')
    deletePurchaseOrder(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.purchaseOrdersService.deletePurchaseOrder(id, user);
    }

    @Patch('/:id/status')
    updatePurchaseOrderStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', PurchaseOrderStatusValidationPipe) status: PurchaseOrderStatus,
        @GetUser() user: User
    ): Promise<PurchaseOrder> {
        return this.purchaseOrdersService.updatePurchaseOrderStatus(id, status, user);
    }
}
