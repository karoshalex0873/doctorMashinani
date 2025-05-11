import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Diagnosis } from "./Diagnosis";
import { User } from "./User"; // Import the User entity

@Entity()
export class SymptomEntry extends BaseEntity {
  @PrimaryGeneratedColumn()
  entry_id!: number;

  @ManyToOne(() => User, (user) => user.symptomEntries, { onDelete: 'CASCADE' }) // Link directly to the User entity
  user!: User;

  @Column()
  description!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @OneToMany(() => Diagnosis, (diagnosis) => diagnosis.symptom)
  diagnoses!: Diagnosis[];
}
