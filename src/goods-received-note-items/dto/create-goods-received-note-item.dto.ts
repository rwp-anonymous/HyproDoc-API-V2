import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumberString } from "class-validator";
import { ItemUnits } from "../../items/item-units.enum";

export class CreateGoodsReceivedNoteItemDto {
    @ApiModelProperty()
    @IsNotEmpty()
    code: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsString()
    comments: string;

    @ApiModelProperty()
    @IsNotEmpty()
    unit: ItemUnits;

    @ApiModelProperty()
    @IsNumberString()
    orderedQuantity: number;

    @ApiModelProperty()
    @IsNumberString()
    deliveredQuantity: number;

    @ApiModelProperty()
    @IsNumberString()
    pricePerUnit: number;
}