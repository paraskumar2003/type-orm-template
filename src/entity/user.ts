import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()

export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    mobile!: number;

    @Column()
    password!: string;
}