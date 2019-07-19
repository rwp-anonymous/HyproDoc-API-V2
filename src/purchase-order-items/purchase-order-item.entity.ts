import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ItemUnits } from "../items/item-units.enum";

@Entity()
export class PurchaseOrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    unit: ItemUnits;

    @Column()
    deliverdQuantity: number;

    @Column()
    pricePerUnit: number;
}