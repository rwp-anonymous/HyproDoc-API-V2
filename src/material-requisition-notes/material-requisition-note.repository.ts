import { Repository, EntityRepository } from "typeorm";
import { MaterialRequisitionNote } from "./material-requisition-note.entity";
import { CreateMaterialRequisitionNoteDto } from "./dto/create-material-requisition-note.dto";
import { MaterialRequisitionNoteStatus } from "./material-requisition-note-status.enum";
import { GetMaterialRequisitionNotesFilterDto } from "./dto/get-material-requisition-notes-filter.dto";
import { User } from "../auth/user.entity";
import { UserRoles } from "../auth/user-roles.enum";
import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";

@EntityRepository(MaterialRequisitionNote)
export class MaterialRequisitionNoteRepository extends Repository<MaterialRequisitionNote> {
    private logger = new Logger('MaterialRequisitionNoteRepository');

    async getMaterialRequisitionNotes(
        filterDto: GetMaterialRequisitionNotesFilterDto,
        user: User
    ): Promise<MaterialRequisitionNote[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('materialRequisitionNote');

        if (user.role !== UserRoles.ADMIN) {
            query.where('(materialRequisitionNote.requestedById = :userId OR materialRequisitionNote.approvedById = :userId)', { userId: user.id })
        }

        if (status) {
            query.andWhere('materialRequisitionNote.status = :status', { status })
        }

        if (search) {
            query.andWhere('(materialRequisitionNote.mrnNo LIKE :search OR materialRequisitionNote.siteLocation LIKE :search)', { search: `%${search}%` })
        }

        try {
            const materialRequisitionNotes = await query
                .leftJoinAndSelect("materialRequisitionNote.items", "item")
                .getMany();
            return materialRequisitionNotes;
        } catch (error) {
            this.logger.error(`Failed to get material requisition notes for user "${user.email}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
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

        try {
            await materialRequisitionNote.save();
        } catch (error) {
            this.logger.error(`Failed to create a  material requisition note for user "${user.email}". DTO: ${JSON.stringify(createMaterialRequisitionNoteDto)}`, error.stack);

            if (error.code === '23505') {   // duplicate mrn
                throw new ConflictException('Duplicate MRN Number');
            } else {
                throw new InternalServerErrorException();
            }
        }

        // await materialRequisitionNote.save();

        delete materialRequisitionNote.requestedBy;

        return materialRequisitionNote;
    }
}