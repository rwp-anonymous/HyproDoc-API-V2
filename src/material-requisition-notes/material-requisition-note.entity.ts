import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { MaterialRequisitionNoteStatus } from "./material-requisition-note.model";

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

    @Column()
    approvedDate: Date;

    @Column()
    approvedBy: Date;

    @Column({ array: true })
    items: string;

    @Column()
    status: MaterialRequisitionNoteStatus;
}