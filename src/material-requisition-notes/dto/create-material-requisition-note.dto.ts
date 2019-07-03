export class Item {
    itemNo: string;
    itemName: string;
    unit: string;
    qty: number;
    remarks: string;
}
export class CreateMaterialRequisitionNoteDto {
    mrnNo: string;
    siteLocation: string;
    requestDate: Date;
    requestedBy: string;
    approvedBy: string;
    items: Item[];
}