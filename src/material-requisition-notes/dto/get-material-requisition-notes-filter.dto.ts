import { MaterialRequisitionNoteStatus } from "../material-requisition-note.model";

export class GetMaterialRequisitionNotesFilterDto {
    status: MaterialRequisitionNoteStatus;
    search: string;
}