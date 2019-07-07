import { Repository, EntityRepository } from "typeorm";
import { MaterialRequisitionNote } from "./material-requisition-note.entity";
import { CreateMaterialRequisitionNoteDto } from "./dto/create-material-requisition-note.dto";
import { MaterialRequisitionNoteStatus } from "./material-requisition-note-status.enum";
import { GetMaterialRequisitionNotesFilterDto } from "./dto/get-material-requisition-notes-filter.dto";
import { User } from "../auth/user.entity";

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

    async createMaterialRequisitionNote(
        createMaterialRequisitionNoteDto: CreateMaterialRequisitionNoteDto,
        user: User
    ): Promise<MaterialRequisitionNote> {
        const { mrnNo, siteLocation, items } = createMaterialRequisitionNoteDto;

        const materialRequisitionNote = new MaterialRequisitionNote();
        materialRequisitionNote.mrnNo = mrnNo;
        materialRequisitionNote.siteLocation = siteLocation;
        materialRequisitionNote.requestDate = new Date();
        materialRequisitionNote.requestedBy = user;
        materialRequisitionNote.items = items;
        materialRequisitionNote.status = MaterialRequisitionNoteStatus.REQUESTED;

        await materialRequisitionNote.save();

        delete materialRequisitionNote.requestedBy;

        return materialRequisitionNote;
    }
}