import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, ManyToMany, JoinTable } from "typeorm";
import { User } from "../auth/user.entity";
import { Item } from "../items/item.entity";
import { GoodsReceivedNoteItem } from "../goods-received-note-items/goods-received-note-item.entity";

@Entity()
@Unique(['grnNo'])
export class GoodsReceivedNote extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    grnNo: string;

    @Column()
    siteLocation: string;

    @Column()
    supplier: string;

    @Column()
    acknowledgedDate: Date;

    @ManyToOne(type => User, user => user.acknowledgedGoodsReceivedNotes, { eager: false })
    acknowledgedBy: User;

    @Column()
    acknowledgedById: number;

    @ManyToMany(type => Item)
    @JoinTable()
    items: Item[];

    @ManyToMany(type => GoodsReceivedNoteItem)
    @JoinTable()
    goodsReceivedNoteItems: GoodsReceivedNoteItem[];
}