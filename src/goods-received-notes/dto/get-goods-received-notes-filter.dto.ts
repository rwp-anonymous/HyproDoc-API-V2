import { IsOptional, IsIn, IsNotEmpty } from "class-validator";

export class GetGoodsReceivedNotesFilterDto {
    @IsOptional()
    @IsNotEmpty()
    search: string;
}