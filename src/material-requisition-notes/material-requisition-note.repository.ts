import { Repository, EntityRepository } from "typeorm";
import { MaterialRequisitionNote } from "./material-requisition-note.entity";

@EntityRepository(MaterialRequisitionNote)
export class MaterialRequisitionNoteRepository extends Repository<MaterialRequisitionNote> {

}