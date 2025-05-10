import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SymptomEntry } from "./SymptomEntry";
import { DoctorProfile } from "./DoctorProfile";
import { Prescription } from "./Prescription";

@Entity()
export class Diagnosis extends BaseEntity{
  @PrimaryGeneratedColumn()
  diagnosis_id!:number

  @ManyToOne(() => SymptomEntry, (symptom) => symptom.diagnoses, { onDelete: 'CASCADE' })
  symptom!: SymptomEntry;

  @ManyToOne(()=>DoctorProfile,{nullable:true,onDelete:'SET NULL'})
  doctor!:DoctorProfile

  @Column()
  ai_condition!: string;

  @Column({ nullable: true })
  confirmed_condition!: string;

  @Column()
  severity_level!: string; // mild, moderate, critical

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Prescription, (prescription) => prescription.diagnosis)
  prescriptions!: Prescription[];
}