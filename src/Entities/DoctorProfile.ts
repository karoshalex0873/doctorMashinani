import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class DoctorProfile extends BaseEntity{
  @PrimaryGeneratedColumn()
  doctor_id!:number

  @OneToOne(()=>User,{cascade:true, onDelete:'CASCADE'})
  @JoinColumn()
  user!:User

  @Column()
  specialization!:string

  @Column("decimal",{default:0})
  salary!:number

  @Column({default:true})
  availability!:boolean
}