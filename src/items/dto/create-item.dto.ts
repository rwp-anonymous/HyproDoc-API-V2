import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumberString } from "class-validator";
import { ItemUnits } from "../item-units.enum";
import { StoreLocations } from "../store-location.enum";

export class CreateItemDto {
    @ApiModelProperty()
    @IsNotEmpty()
    code: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiModelProperty()
    @IsNotEmpty()
    unit: ItemUnits;

    @ApiModelProperty()
    @IsNumberString()
    quantity: number;

    @ApiModelProperty()
    @IsNumberString()
    threshold: number;

    @ApiModelProperty()
    @IsNotEmpty()
    storeLocation: StoreLocations;

    @ApiModelProperty()
    @IsString()
    supplier: string;
}