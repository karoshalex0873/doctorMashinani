import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Diagnosis } from "./Diagnosis";


@Entity()
export class Prescription extends BaseEntity{
  @PrimaryGeneratedColumn()
  prescription_id!:number

  @ManyToOne(()=>Diagnosis,(diagnosis)=>diagnosis.prescriptions,{
    onDelete:'CASCADE'
  })
  diagnosis!: Diagnosis;

  @Column()
  drug_name!: string;

  @Column()
  dosage!: string;

  @Column()
  instructions!: string;

  

  @CreateDateColumn()
  prescribed_at!: Date;

}