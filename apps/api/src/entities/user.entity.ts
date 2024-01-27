import { Role } from "@shared-lib/enums";
import { IUser } from "@shared-lib/models";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail } from "class-validator";

@Entity()
export class User implements IUser {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, unique: true })
    @IsEmail()
    email: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({type: 'enum', enum: Role, default: Role.USER, select: false})
    role: Role;
    
}