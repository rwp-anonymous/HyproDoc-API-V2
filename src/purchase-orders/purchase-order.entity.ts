import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, ManyToMany, JoinTable } from "typeorm";
import { PurchaseOrderStatus } from "./purchase-order-status.enum";
import { User } from "../auth/user.entity";
import { Item } from "../items/item.entity";
import { PurchaseOrderItem } from "../purchase-order-items/purchase-order-item.entity";

@Entity()
@Unique(['poNo'])
export class PurchaseOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    poNo: string;

    @Column()
    siteLocation: string;

    @Column()
    supplier: string;

    @Column()
    issuedDate: Date;

    @ManyToOne(type => User, user => user.issuedPurchaseOrders, { eager: false })
    issuedBy: User;

    @Column()
    issuedById: number;

    @Column({ nullable: true })
    approvedDate: Date;

    @ManyToOne(type => User, user => user.approvedPurchaseOrders, { eager: false })
    approvedBy: User;

    @Column({ nullable: true })
    approvedById: number;

    @ManyToMany(type => Item)
    @JoinTable()
    items: Item[];

    @ManyToMany(type => PurchaseOrderItem)
    @JoinTable()
    purchaseOrderItems: PurchaseOrderItem[];

    @Column()
    status: PurchaseOrderStatus;
}