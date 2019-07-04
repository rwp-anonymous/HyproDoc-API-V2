import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { MaterialRequisitionNoteStatus } from "./material-requisition-note-status.enum";

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

    @Column()
    requestedBy: string;

    @Column({ nullable: true })
    approvedDate: Date;

    @Column({ nullable: true })
    approvedBy: string;

    @Column()
    items: string;

    @Column()
    status: MaterialRequisitionNoteStatus;
}