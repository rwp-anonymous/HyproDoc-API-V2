import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UserRoles } from "./user-roles.enum";
import { MaterialRequisitionNote } from "../material-requisition-notes/material-requisition-note.entity";
import { Item } from "../items/item.entity";

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column()
    role: UserRoles;

    @Column({ nullable: true })
    avatarUrl: string;

    @OneToMany(type => MaterialRequisitionNote, materialRequisitionNote => materialRequisitionNote.requestedBy, { eager: true })
    requestedMaterialRequisitionNotes: MaterialRequisitionNote[];

    @OneToMany(type => MaterialRequisitionNote, materialRequisitionNote => materialRequisitionNote.approvedBy, { eager: true })
    approvedMaterialRequisitionNotes: MaterialRequisitionNote[];

    @OneToMany(type => Item, item => item.createdBy, { eager: true })
    createdItems: Item[];

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}