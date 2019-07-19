import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Item } from '../../items/item.entity';
import { PurchaseOrderItem } from '../../purchase-order-items/purchase-order-item.entity';

export class CreatePurchaseOrderDto {
    @ApiModelProperty()
    @IsNotEmpty()
    poNo: string;

    @ApiModelProperty()
    @IsNotEmpty()
    siteLocation: string;

    @ApiModelProperty()
    @IsNotEmpty()
    supplier: string;

    @ApiModelProperty()
    @IsNotEmpty()
    items: Item[];

    @ApiModelProperty()
    @IsNotEmpty()
    purchaseOrderItems: PurchaseOrderItem[];
}