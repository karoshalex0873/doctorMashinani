import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id!: number;
  
  @Column()
  name!:string

  @Column()
  email!:string

  @Column()
  passoword!:string

}