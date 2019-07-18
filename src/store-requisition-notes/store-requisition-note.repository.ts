import { Repository, EntityRepository } from "typeorm";
import { StoreRequisitionNote } from "./store-requisition-note.entity";
import { CreateStoreRequisitionNoteDto } from "./dto/create-store-requisition-note.dto";
import { StoreRequisitionNoteStatus } from "./store-requisition-note-status.enum";
import { GetStoreRequisitionNotesFilterDto } from "./dto/get-store-requisition-notes-filter.dto";
import { User } from "../auth/user.entity";
import { UserRoles } from "../auth/user-roles.enum";
import { ConflictException, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { StoreRequisitionNoteItem } from "../store-requisition-note-items/store-requisition-note-item.entity";

@EntityRepository(StoreRequisitionNote)
export class StoreRequisitionNoteRepository extends Repository<StoreRequisitionNote> {
    private logger = new Logger('StoreRequisitionNoteRepository');

    async getStoreRequisitionNotes(
        filterDto: GetStoreRequisitionNotesFilterDto,
        user: User
    ): Promise<StoreRequisitionNote[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('storeRequisitionNote');

        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.SITE_ENGINEER,
            UserRoles.PROJECT_MANAGER
        ]

        if (!this.isRoleValid(user.role, allowedRoles)) {
            query.where('(storeRequisitionNote.requestedById = :userId OR storeRequisitionNote.approvedById = :userId)', { userId: user.id })
        }

        if (status) {
            query.andWhere('storeRequisitionNote.status = :status', { status })
        }

        if (search) {
            query.andWhere('(storeRequisitionNote.srnNo LIKE :search OR storeRequisitionNote.siteLocation LIKE :search)', { search: `%${search}%` })
        }

        try {
            const storeRequisitionNotes = await query
                .leftJoinAndSelect("storeRequisitionNote.items", "item")
                .leftJoinAndSelect("storeRequisitionNote.storeRequisitionNoteItems", "storeRequisitionNoteItem")
                .innerJoinAndSelect("storeRequisitionNote.requestedBy", "user")
                .getMany();

            const newStoreRequisitionNotes = storeRequisitionNotes.map(({ requestedBy: { password, ...restOfObj }, ...restOfNote }) => Object.assign({ ...restOfNote, requestedBy: restOfObj }))

            return newStoreRequisitionNotes;
        } catch (error) {
            this.logger.error(`Failed to get store requisition notes for user "${user.email}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createStoreRequisitionNote(
        createStoreRequisitionNoteDto: CreateStoreRequisitionNoteDto,
        user: User
    ): Promise<StoreRequisitionNote> {
        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.STORE_KEEPER
        ]

        if (this.isRoleValid(user.role, allowedRoles)) {

            const { srnNo, siteLocation, items, storeRequisitionNoteItems } = createStoreRequisitionNoteDto;

            const savedStoreRequisitionNoteItems = await this.createStoreRequisitionNoteItems(storeRequisitionNoteItems);

            const storeRequisitionNote = new StoreRequisitionNote();
            storeRequisitionNote.srnNo = srnNo;
            storeRequisitionNote.siteLocation = siteLocation;
            storeRequisitionNote.requestDate = new Date();
            storeRequisitionNote.requestedBy = user;
            storeRequisitionNote.items = items;
            storeRequisitionNote.storeRequisitionNoteItems = savedStoreRequisitionNoteItems;
            storeRequisitionNote.status = StoreRequisitionNoteStatus.REQUESTED;

            try {
                await storeRequisitionNote.save();
            } catch (error) {
                this.logger.error(`Failed to create a  store requisition note for user "${user.email}". DTO: ${JSON.stringify(createStoreRequisitionNoteDto)}`, error.stack);

                if (error.code === '23505') {   // duplicate mrn
                    throw new ConflictException('Duplicate MRN Number');
                } else {
                    throw new InternalServerErrorException();
                }
            }

            delete storeRequisitionNote.requestedBy;

            return storeRequisitionNote;
        } else {
            throw new UnauthorizedException();
        }
    }

    async createStoreRequisitionNoteItems(items: StoreRequisitionNoteItem[]): Promise<StoreRequisitionNoteItem[]> {
        let savedStoreRequisitionNoteItems: StoreRequisitionNoteItem[] = [];
        for await (const item of items) {
            const newItem = new StoreRequisitionNoteItem();
            newItem.mrnNo = item.mrnNo;
            newItem.code = item.code;
            newItem.description = item.description;
            newItem.unit = item.unit;
            newItem.orderQuantity = item.orderQuantity

            try {
                await newItem.save();
            } catch (error) {
                if (error.code === '23505') {   // duplicate mrn
                    throw new ConflictException('Duplicate MRN Number');
                } else {
                    throw new InternalServerErrorException();
                }
            }
            savedStoreRequisitionNoteItems.push(newItem);
        }
        return savedStoreRequisitionNoteItems;
    }

    private isRoleValid(role: any, allowedRoles: UserRoles[]) {
        const idx = allowedRoles.indexOf(role);
        return idx !== -1;
    }
}