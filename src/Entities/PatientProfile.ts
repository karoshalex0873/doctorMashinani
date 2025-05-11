import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { SymptomEntry } from "./SymptomEntry";
import { NurseProfile } from "./NurseProfile";


@Entity()
export class PatientProfile extends BaseEntity {
  @PrimaryGeneratedColumn()
  patient_id!:number
  
  @OneToOne(()=>User,{cascade:true,onDelete:'CASCADE'})
  @JoinColumn()
  user!:User

  @Column("decimal",{default:0})
  wallet_balance!: number;

  @Column({ nullable: true })
  insurance_info!: string;

  @Column()
  address!: string

  @OneToMany(() => NurseProfile, nurse => nurse.assigned_patient, { cascade: true })
  nurses!: NurseProfile[];
}