import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumberString } from "class-validator";
import { ItemUnits } from "../../items/item-units.enum";

export class CreatePurchaseOrderItemDto {
    @ApiModelProperty()
    @IsNotEmpty()
    code: string;

    @ApiModelProperty()
    @IsNotEmpty()
    unit: ItemUnits;

    @ApiModelProperty()
    @IsNumberString()
    deliverdQuantity: number;

    @ApiModelProperty()
    @IsNumberString()
    pricePerUnit: number;
}