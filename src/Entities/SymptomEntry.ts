import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PatientProfile } from "./PatientProfile";
import { Diagnosis } from "./Diagnosis";


@Entity()
export  class SymptomEntry extends BaseEntity{
  @PrimaryGeneratedColumn()
  entry_id!:number

  @ManyToOne(() => PatientProfile, (patient) => patient.symptomEntries, { onDelete: 'CASCADE' })
  patient!: PatientProfile;

  @Column()
  description!: string;

  @Column({ nullable: true })
  audio_url!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @OneToMany(() => Diagnosis, (diagnosis) => diagnosis.symptom)
  diagnoses!: Diagnosis[];
}