import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Item } from '../../items/item.entity';
import { StoreRequisitionNoteItem } from '../../store-requisition-note-items/store-requisition-note-item.entity';

export class CreateStoreRequisitionNoteDto {
    @ApiModelProperty()
    @IsNotEmpty()
    srnNo: string;

    @ApiModelProperty()
    @IsNotEmpty()
    siteLocation: string;

    @ApiModelProperty()
    @IsNotEmpty()
    items: Item[];

    @ApiModelProperty()
    @IsNotEmpty()
    storeRequisitionNoteItems: StoreRequisitionNoteItem[];
}