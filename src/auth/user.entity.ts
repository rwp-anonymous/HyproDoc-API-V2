import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import { UserRoles } from "./user-roles.enum";

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
    salt: string;

    @Column()
    role: UserRoles;

    @Column({ nullable: true })
    avatarUrl: string
}