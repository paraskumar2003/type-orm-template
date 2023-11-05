import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class ProductRatings {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ratings!: string;
}