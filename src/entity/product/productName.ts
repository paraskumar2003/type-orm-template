import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: "product_list" })

export default class ProductName extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    amount!: number;

    @Column()
    ratings!: number;

    @Column()
    category!: number;
}