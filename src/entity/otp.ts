import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()

export default class Otp extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    otp!: number;

    @Column()
    mobile!: string;

    @Column()
    status!: number; //=> 0 - default, 1 - sent, 2 - verified, 3 - expired, expiry time - 5min

}