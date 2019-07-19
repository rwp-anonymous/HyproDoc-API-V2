import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumberString } from "class-validator";
import { ItemUnits } from "../../items/item-units.enum";

export class CreateGoodsIssueNoteItemDto {
    @ApiModelProperty()
    @IsNotEmpty()
    mrnNo: string;

    @ApiModelProperty()
    @IsNotEmpty()
    code: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsString()
    remarks: string;

    @ApiModelProperty()
    @IsNotEmpty()
    unit: ItemUnits;

    @ApiModelProperty()
    @IsNumberString()
    issuedQuantity: number;
}