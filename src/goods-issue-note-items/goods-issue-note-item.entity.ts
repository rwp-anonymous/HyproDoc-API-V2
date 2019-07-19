import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ItemUnits } from "../items/item-units.enum";

@Entity()
export class GoodsIssueNoteItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mrnNo: string;

    @Column()
    code: string;

    @Column()
    description: string;

    @Column()
    remarks: string;

    @Column()
    unit: ItemUnits;

    @Column()
    issuedQuantity: number;
}