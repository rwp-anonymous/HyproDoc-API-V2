import { Repository, EntityRepository } from "typeorm";
import { InternalServerErrorException, ConflictException } from "@nestjs/common";
import { CreateMaterialRequisitionNoteItemDto } from "./dto/create-material-requisition-note-item.dto";
import { MaterialRequisitionNoteItem } from "./material-requisition-note-item.entity";

@EntityRepository(MaterialRequisitionNoteItem)
export class MaterialRequisitionNoteItemRepository extends Repository<MaterialRequisitionNoteItem> {
    async createItem(
        createMaterialRequisitionNoteItemItemDto: CreateMaterialRequisitionNoteItemDto
    ): Promise<MaterialRequisitionNoteItem> {
        // if (user.role === UserRoles.STORE_KEEPER || user.role === UserRoles.ADMIN) {
        const { code, remarks, quantity, unit } = createMaterialRequisitionNoteItemItemDto;

        const item = new MaterialRequisitionNoteItem();

        item.code = code;
        item.remarks = remarks;
        item.unit = unit;
        item.quantity = quantity;

        try {
            await item.save();
        } catch (error) {
            if (error.code === '23505') {   // duplicate item
                throw new ConflictException('Duplicate Item Code');
            } else {
                throw new InternalServerErrorException();
            }
        }

        return item;
        // } else {
        //     throw new UnauthorizedException();
        // }
    }
}