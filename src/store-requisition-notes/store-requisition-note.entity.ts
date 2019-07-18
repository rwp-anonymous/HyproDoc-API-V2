import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, ManyToMany, JoinTable } from "typeorm";
import { StoreRequisitionNoteStatus } from "./store-requisition-note-status.enum";
import { User } from "../auth/user.entity";
import { Item } from "../items/item.entity";
import { StoreRequisitionNoteItem } from "../store-requisition-note-items/store-requisition-note-item.entity";

@Entity()
@Unique(['srnNo'])
export class StoreRequisitionNote extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    srnNo: string;

    @Column()
    siteLocation: string;

    @Column()
    requestDate: Date;

    @ManyToOne(type => User, user => user.requestedStoreRequisitionNotes, { eager: false })
    requestedBy: User;

    @Column()
    requestedById: number;

    @Column({ nullable: true })
    approvedDate: Date;

    @ManyToOne(type => User, user => user.approvedStoreRequisitionNotes, { eager: false })
    approvedBy: User;

    @Column({ nullable: true })
    approvedById: number;

    @ManyToMany(type => Item)
    @JoinTable()
    items: Item[];

    @ManyToMany(type => StoreRequisitionNoteItem)
    @JoinTable()
    storeRequisitionNoteItems: StoreRequisitionNoteItem[];

    @Column()
    status: StoreRequisitionNoteStatus;
}