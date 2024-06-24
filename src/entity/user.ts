import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from "typeorm";

@Entity()
@Index(['email', 'mobile'])
@Index(['mobile'])
@Index("UNIQ_MOBILE", ['mobile'], { unique: true })
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