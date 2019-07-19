import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Item } from '../../items/item.entity';
import { GoodsReceivedNoteItem } from '../../goods-received-note-items/goods-received-note-item.entity';

export class CreateGoodsReceivedNoteDto {
    @ApiModelProperty()
    @IsNotEmpty()
    grnNo: string;

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
    goodsReceivedNoteItems: GoodsReceivedNoteItem[];
}