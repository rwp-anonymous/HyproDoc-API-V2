import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateMaterialRequisitionNoteDto {
    @ApiModelProperty()
    @IsNotEmpty()
    mrnNo: string;

    @ApiModelProperty()
    @IsNotEmpty()
    siteLocation: string;

    @ApiModelProperty()
    @IsNotEmpty()
    requestDate: Date;

    @ApiModelProperty()
    @IsNotEmpty()
    requestedBy: string;

    @ApiModelProperty()
    approvedDate: Date;

    @ApiModelProperty()
    approvedBy: string;

    @ApiModelProperty()
    @IsNotEmpty()
    items: string;
}