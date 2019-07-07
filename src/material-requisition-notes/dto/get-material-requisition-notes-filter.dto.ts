import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { MaterialRequisitionNoteStatus } from "../material-requisition-note-status.enum";

export class GetMaterialRequisitionNotesFilterDto {
    @IsOptional()
    @IsIn([MaterialRequisitionNoteStatus.REQUESTED, MaterialRequisitionNoteStatus.APPROVED])
    status: MaterialRequisitionNoteStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}