import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { MaterialRequisitionNoteStatus } from "./material-requisition-note-status.enum";
import { User } from "../auth/user.entity";

@Entity()
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

    @Column({ nullable: true })
    approvedDate: Date;

    @ManyToOne(type => User, user => user.approvedMaterialRequisitionNotes, { eager: false })
    approvedBy: User;

    @Column()
    items: string;

    @Column()
    status: MaterialRequisitionNoteStatus;
}