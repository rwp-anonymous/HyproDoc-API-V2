export interface Item {
    itemNo: string;
    itemName: string;
    unit: string;
    qty: number;
    remarks: string;
}

export interface MaterialRequisitionNote {
    id: string,
    mrnNo: string,
    siteLocation: string,
    requestDate: Date;
    requestedBy: string;
    approvedBy: string;
    items: Item[];
    status: MaterialRequisitionNoteStatus
}

export enum MaterialRequisitionNoteStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}