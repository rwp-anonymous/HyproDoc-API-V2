import { Repository, EntityRepository } from "typeorm";
import { MaterialRequisitionNote } from "./material-requisition-note.entity";
import { CreateMaterialRequisitionNoteDto } from "./dto/create-material-requisition-note.dto";
import { MaterialRequisitionNoteStatus } from "./material-requisition-note-status.enum";
import { GetMaterialRequisitionNotesFilterDto } from "./dto/get-material-requisition-notes-filter.dto";
import { User } from "../auth/user.entity";
import { UserRoles } from "../auth/user-roles.enum";
import { ConflictException, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { MaterialRequisitionNoteItem } from "../material-requisition-note-items/material-requisition-note-item.entity";

@EntityRepository(MaterialRequisitionNote)
export class MaterialRequisitionNoteRepository extends Repository<MaterialRequisitionNote> {
    private logger = new Logger('MaterialRequisitionNoteRepository');

    async getMaterialRequisitionNotes(
        filterDto: GetMaterialRequisitionNotesFilterDto,
        user: User
    ): Promise<MaterialRequisitionNote[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('materialRequisitionNote');

        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.SITE_ENGINEER
        ]

        if (!this.isRoleValid(user.role, allowedRoles)) {
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
                .leftJoinAndSelect("materialRequisitionNote.materialRequisitionNoteItems", "materialRequisitionNoteItem")
                .innerJoinAndSelect("materialRequisitionNote.requestedBy", "user")
                .getMany();

            const newMaterialRequisitionNotes = materialRequisitionNotes.map(({ requestedBy: { password, ...restOfObj }, ...restOfNote }) => Object.assign({ ...restOfNote, requestedBy: restOfObj }))

            return newMaterialRequisitionNotes;
        } catch (error) {
            this.logger.error(`Failed to get material requisition notes for user "${user.email}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createMaterialRequisitionNote(
        createMaterialRequisitionNoteDto: CreateMaterialRequisitionNoteDto,
        user: User
    ): Promise<MaterialRequisitionNote> {
        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.SITE_ENGINEER,
            UserRoles.FOREMAN
        ]

        if (this.isRoleValid(user.role, allowedRoles)) {

            const { mrnNo, siteLocation, items, materialRequisitionNoteItems } = createMaterialRequisitionNoteDto;

            const savedMaterialRequisitionNoteItems = await this.createMaterialRequisitionNoteItems(materialRequisitionNoteItems);

            const materialRequisitionNote = new MaterialRequisitionNote();
            materialRequisitionNote.mrnNo = mrnNo;
            materialRequisitionNote.siteLocation = siteLocation;
            materialRequisitionNote.requestDate = new Date();
            materialRequisitionNote.requestedBy = user;
            materialRequisitionNote.items = items;
            materialRequisitionNote.materialRequisitionNoteItems = savedMaterialRequisitionNoteItems;
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

            delete materialRequisitionNote.requestedBy;

            return materialRequisitionNote;
        } else {
            throw new UnauthorizedException();
        }
    }

    async createMaterialRequisitionNoteItems(items: MaterialRequisitionNoteItem[]): Promise<MaterialRequisitionNoteItem[]> {
        let savedMaterialRequisitionNoteItems: MaterialRequisitionNoteItem[] = [];
        for await (const item of items) {
            const newItem = new MaterialRequisitionNoteItem();
            newItem.code = item.code;
            newItem.remarks = item.remarks;
            newItem.unit = item.unit;
            newItem.quantity = item.quantity

            try {
                await newItem.save();
            } catch (error) {
                if (error.code === '23505') {   // duplicate mrn
                    throw new ConflictException('Duplicate MRN Number');
                } else {
                    throw new InternalServerErrorException();
                }
            }
            savedMaterialRequisitionNoteItems.push(newItem);
        }
        return savedMaterialRequisitionNoteItems;
    }

    private isRoleValid(role: any, allowedRoles: UserRoles[]) {
        const idx = allowedRoles.indexOf(role);
        return idx !== -1;
    }
}