import { IsOptional, IsNotEmpty, IsIn } from "class-validator";
import { StoreLocations } from "../store-location.enum";

export class GetItemsFilterDto {
    @IsOptional()
    @IsIn([StoreLocations.UGANDA, StoreLocations.SRI_LANKA])
    storeLocation: StoreLocations;

    @IsOptional()
    @IsNotEmpty()
    code: string;
}