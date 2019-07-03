import { IsNotEmpty } from 'class-validator'

export class Item {
    itemNo: string;
    itemName: string;
    unit: string;
    qty: number;
    remarks: string;
}
export class CreateMaterialRequisitionNoteDto {
    @IsNotEmpty()
    mrnNo: string;

    @IsNotEmpty()
    siteLocation: string;

    @IsNotEmpty()
    requestDate: Date;

    @IsNotEmpty()
    requestedBy: string;

    approvedDate: Date;

    approvedBy: string;

    @IsNotEmpty()
    items: Item[];
}