import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { StoreRequisitionNoteStatus } from "../store-requisition-note-status.enum";

export class GetStoreRequisitionNotesFilterDto {
    @IsOptional()
    @IsIn([StoreRequisitionNoteStatus.REQUESTED, StoreRequisitionNoteStatus.APPROVED])
    status: StoreRequisitionNoteStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}