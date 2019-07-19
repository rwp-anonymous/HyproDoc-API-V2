import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { UserRoles } from "./user-roles.enum";
import { MaterialRequisitionNote } from "../material-requisition-notes/material-requisition-note.entity";
import { StoreRequisitionNote } from "../store-requisition-notes/store-requisition-note.entity";
import { PurchaseOrder } from "../purchase-orders/purchase-order.entity";
import { GoodsReceivedNote } from "../goods-received-notes/goods-received-note.entity";
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

    @OneToMany(type => StoreRequisitionNote, storeRequisitionNote => storeRequisitionNote.requestedBy, { eager: true })
    requestedStoreRequisitionNotes: MaterialRequisitionNote[];

    @OneToMany(type => StoreRequisitionNote, storeRequisitionNote => storeRequisitionNote.approvedBy, { eager: true })
    approvedStoreRequisitionNotes: MaterialRequisitionNote[];

    @OneToMany(type => PurchaseOrder, purchaseOrder => purchaseOrder.issuedBy, { eager: true })
    issuedPurchaseOrders: PurchaseOrder[];

    @OneToMany(type => PurchaseOrder, purchaseOrder => purchaseOrder.approvedBy, { eager: true })
    approvedPurchaseOrders: PurchaseOrder[];

    @OneToMany(type => GoodsReceivedNote, goodsReceivedNote => goodsReceivedNote.acknowledgedBy, { eager: true })
    acknowledgedGoodsReceivedNotes: GoodsReceivedNote[];

    @OneToMany(type => Item, item => item.createdBy, { eager: true })
    createdItems: Item[];

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}