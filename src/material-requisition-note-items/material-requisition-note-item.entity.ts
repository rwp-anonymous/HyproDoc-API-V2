import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ItemUnits } from "../items/item-units.enum";

@Entity()
export class MaterialRequisitionNoteItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    remarks: string;

    @Column()
    unit: ItemUnits;

    @Column()
    quantity: number;
}