import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PatientProfile } from "./PatientProfile";


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
}