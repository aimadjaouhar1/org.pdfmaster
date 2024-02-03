import { Role } from "@shared-lib/enums";
import { IUser } from "@shared-lib/interfaces";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, IsEnum, IsString, IsUUID } from "class-validator";

@Entity()
export class User implements IUser {

    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id: string;

    @Column({ nullable: false, unique: true })
    @IsEmail()
    email: string;

    @Column({ nullable: false, select: false })
    @IsString()
    password: string;

    @Column({ nullable: false })
    @IsString()
    firstname: string;

    @Column({ nullable: false })
    @IsString()
    lastname: string;

    @Column({type: 'enum', enum: Role, default: Role.USER, select: false})
    @IsEnum(Role)
    role: Role;
    
}