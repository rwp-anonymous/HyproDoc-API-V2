import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Item } from '../../items/item.entity';
import { GoodsIssueNoteItem } from '../../goods-issue-note-items/goods-issue-note-item.entity';

export class CreateGoodsIssueNoteDto {
    @ApiModelProperty()
    @IsNotEmpty()
    ginNo: string;

    @ApiModelProperty()
    @IsNotEmpty()
    siteLocation: string;

    @ApiModelProperty()
    @IsNotEmpty()
    items: Item[];

    @ApiModelProperty()
    @IsNotEmpty()
    goodsIssueNoteItems: GoodsIssueNoteItem[];
}