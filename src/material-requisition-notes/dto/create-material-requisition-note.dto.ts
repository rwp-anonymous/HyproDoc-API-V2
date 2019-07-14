import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Item } from '../../items/item.entity';
import { MaterialRequisitionNoteItem } from '../../material-requisition-note-items/material-requisition-note-item.entity';

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

    @ApiModelProperty()
    @IsNotEmpty()
    materialRequisitionNoteItems: MaterialRequisitionNoteItem[];
}