import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, ManyToMany, JoinTable } from "typeorm";
import { MaterialRequisitionNoteStatus } from "./material-requisition-note-status.enum";
import { User } from "../auth/user.entity";
import { Item } from "../items/item.entity";
import { MaterialRequisitionNoteItem } from "../material-requisition-note-items/material-requisition-note-item.entity";

@Entity()
@Unique(['mrnNo'])
export class MaterialRequisitionNote extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mrnNo: string;

    @Column()
    siteLocation: string;

    @Column()
    requestDate: Date;

    @ManyToOne(type => User, user => user.requestedMaterialRequisitionNotes, { eager: false })
    requestedBy: User;

    @Column()
    requestedById: number;

    @Column({ nullable: true })
    approvedDate: Date;

    @ManyToOne(type => User, user => user.approvedMaterialRequisitionNotes, { eager: false })
    approvedBy: User;

    @Column({ nullable: true })
    approvedById: number;

    @ManyToMany(type => Item)
    @JoinTable()
    items: Item[];

    @ManyToMany(type => MaterialRequisitionNoteItem)
    @JoinTable()
    materialRequisitionNoteItems: MaterialRequisitionNoteItem[];

    @Column()
    status: MaterialRequisitionNoteStatus;
}