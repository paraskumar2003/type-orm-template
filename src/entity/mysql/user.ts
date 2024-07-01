import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from "typeorm";

@Entity()

// Indexing in a database is a technique used to improve the speed of data retrieval operations 
// by creating a data structure that allows for quick lookup of records.

@Index(['email', 'mobile']) // Creates a composite index on the 'email' and 'mobile' columns to optimize queries that filter by both fields.
@Index(['mobile']) // Creates an index on the 'mobile' column to optimize queries that filter by the 'mobile' field.

export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    mobile!: string;

    @Column()
    password!: string;

    static async createUser(username: string, mobile: string, email: string, password: string) {
        const user = new User();
        user.mobile = mobile;
        user.username = username;
        user.email = email;
        user.password = password;
        return user.save();
    }
}