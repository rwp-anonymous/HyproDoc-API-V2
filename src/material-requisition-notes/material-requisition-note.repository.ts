import { Repository, EntityRepository } from "typeorm";
import { MaterialRequisitionNote } from "./material-requisition-note.entity";
import { CreateMaterialRequisitionNoteDto } from "./dto/create-material-requisition-note.dto";
import { MaterialRequisitionNoteStatus } from "./material-requisition-note-status.enum";
import { GetMaterialRequisitionNotesFilterDto } from "./dto/get-material-requisition-notes-filter.dto";

@EntityRepository(MaterialRequisitionNote)
export class MaterialRequisitionNoteRepository extends Repository<MaterialRequisitionNote> {
    async getMaterialRequisitionNotes(filterDto: GetMaterialRequisitionNotesFilterDto): Promise<MaterialRequisitionNote[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('materialRequisitionNote');

        if (status) {
            query.andWhere('materialRequisitionNote.status = :status', { status })
        }

        if (search) {
            query.andWhere('(materialRequisitionNote.mrnNo LIKE :search OR materialRequisitionNote.siteLocation LIKE :search)', { search: `%${search}%` })
        }

        const materialRequisitionNotes = await query.getMany();
        return materialRequisitionNotes;
    }

    async createMaterialRequisitionNote(createMaterialRequisitionNoteDto: CreateMaterialRequisitionNoteDto): Promise<MaterialRequisitionNote> {
        const { mrnNo, siteLocation, requestDate, requestedBy, approvedDate, approvedBy, items } = createMaterialRequisitionNoteDto;

        const materialRequisitionNote = new MaterialRequisitionNote();
        materialRequisitionNote.mrnNo = mrnNo;
        materialRequisitionNote.siteLocation = siteLocation;
        materialRequisitionNote.requestDate = requestDate;
        materialRequisitionNote.requestedBy = requestedBy;
        materialRequisitionNote.approvedDate = approvedDate;
        materialRequisitionNote.approvedBy = approvedBy;
        materialRequisitionNote.items = items;
        materialRequisitionNote.status = MaterialRequisitionNoteStatus.OPEN;

        await materialRequisitionNote.save();

        return materialRequisitionNote;
    }
}