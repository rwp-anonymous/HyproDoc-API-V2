import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { MaterialRequisitionNoteStatus } from "../material-requisition-note-status.enum";

export class GetMaterialRequisitionNotesFilterDto {
    @IsOptional()
    @IsIn([MaterialRequisitionNoteStatus.OPEN, MaterialRequisitionNoteStatus.IN_PROGRESS, MaterialRequisitionNoteStatus.DONE])
    status: MaterialRequisitionNoteStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}