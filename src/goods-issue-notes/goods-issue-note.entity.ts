import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, ManyToMany, JoinTable } from "typeorm";
import { GoodsIssueNoteStatus } from "./goods-issue-note-status.enum";
import { User } from "../auth/user.entity";
import { Item } from "../items/item.entity";
import { GoodsIssueNoteItem } from "../goods-issue-note-items/goods-issue-note-item.entity";

@Entity()
@Unique(['ginNo'])
export class GoodsIssueNote extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ginNo: string;

    @Column()
    siteLocation: string;

    @Column()
    issuedDate: Date;

    @ManyToOne(type => User, user => user.issuedGoodsIssueNotes, { eager: false })
    issuedBy: User;

    @Column()
    issuedById: number;

    @Column({ nullable: true })
    receivedDate: Date;

    @ManyToOne(type => User, user => user.receivedGoodsIssueNotes, { eager: false })
    receivedBy: User;

    @Column({ nullable: true })
    receivedById: number;

    @ManyToMany(type => Item)
    @JoinTable()
    items: Item[];

    @ManyToMany(type => GoodsIssueNoteItem)
    @JoinTable()
    goodsIssueNoteItems: GoodsIssueNoteItem[];

    @Column()
    status: GoodsIssueNoteStatus;
}