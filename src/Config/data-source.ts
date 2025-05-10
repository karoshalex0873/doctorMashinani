import dotenv from 'dotenv'
dotenv.config()

import {DataSource} from 'typeorm'
import { User } from '../Entities/User'
import { Role } from '../Entities/Role'
import { PatientProfile } from '../Entities/PatientProfile'
import { NurseProfile } from '../Entities/NurseProfile'
import { DoctorProfile } from '../Entities/DoctorProfile'
import { Diagnosis } from '../Entities/Diagnosis'
import { SymptomEntry } from '../Entities/SymptomEntry'
import { Prescription } from '../Entities/Prescription'

export const AppDataSource=new DataSource({
type:'postgres',
host:process.env.LOCAL_DB_HOST,
port:parseInt(process.env.LOCAL_DB_PORT || '5432'),
username:process.env.LOCAL_DB_USER,
password:process.env.LOCAL_DB_PASSWORD,
database:process.env.LOCAL_DB_NAME,
synchronize:true,
entities:[User,Role,PatientProfile,NurseProfile,DoctorProfile,Diagnosis,SymptomEntry,Prescription]
})