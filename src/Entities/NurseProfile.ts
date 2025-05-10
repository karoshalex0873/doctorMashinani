import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { PatientProfile } from "./PatientProfile";


@Entity()
export class NurseProfile extends BaseEntity {
  @PrimaryGeneratedColumn()
  nurse_id!:number

  @OneToOne(()=>User,{cascade:true,onDelete:'CASCADE'})
  @JoinColumn()
  user!:User

  @Column()
  department!:string

  @Column('decimal', { default: 0 })
  salary!: number;

  @Column({ default: true })
  is_active!: boolean;

  @ManyToOne(()=>PatientProfile,patient=>patient.nurses,{onDelete:"SET NULL",nullable:true})
  @JoinColumn()
  assigned_patient!: PatientProfile;
}
