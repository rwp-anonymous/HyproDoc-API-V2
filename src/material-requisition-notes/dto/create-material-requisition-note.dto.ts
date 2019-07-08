import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Item } from '../../items/item.entity';

export class CreateMaterialRequisitionNoteDto {
    @ApiModelProperty()
    @IsNotEmpty()
    mrnNo: string;

    @ApiModelProperty()
    @IsNotEmpty()
    siteLocation: string;

    @ApiModelProperty()
    @IsNotEmpty()
    items: Item[];
}