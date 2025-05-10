import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";


@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column()
  name!: string

  @Column()
  email!: string

  @Column()
  password!: string 

  @Column({nullable:true})
  phone!: string

  @ManyToOne(() => Role, role => role.users, { onDelete: 'SET NULL' })

  @JoinColumn({ name: "role_id" })
  role!: Role;
}