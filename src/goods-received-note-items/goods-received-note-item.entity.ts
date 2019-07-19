import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ItemUnits } from "../items/item-units.enum";

@Entity()
export class GoodsReceivedNoteItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    comments: string;

    @Column()
    unit: ItemUnits;

    @Column()
    orderedQuantity: number;

    @Column()
    deliveredQuantity: number;

    @Column()
    pricePerUnit: number;
}