import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne } from "typeorm";
import { ItemUnits } from "./item-units.enum";
import { User } from "../auth/user.entity";
import { StoreLocations } from "./store-location.enum";

@Entity()
@Unique(['code'])
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    description: string;

    @Column()
    unit: ItemUnits;

    @Column()
    quantity: number;

    @Column()
    threshold: number;

    @Column()
    storeLocation: StoreLocations;

    @Column()
    supplier: string;

    // @ManyToMany(type => MaterialRequisitionNote, materialRequisitionNote => materialRequisitionNote.items)
    // materialRequisitionNotes: MaterialRequisitionNote[];

    @ManyToOne(type => User, user => user.createdItems, { eager: false })
    createdBy: User;

    @Column()
    createdById: number;
}