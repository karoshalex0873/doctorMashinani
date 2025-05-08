import { AppDataSource } from "../Config/data-source";
import { User } from "../Entities/User";
import asyncHandler from "../Middlewares/asyncHandler";
import { NextFunction, Request,Response } from "express";
import bcrypt from 'bcryptjs';

const userRepo=AppDataSource.getRepository(User)

export const registerUser = asyncHandler(
  async(req:Request,res:Response,next:NextFunction)=>{

    const {name,email,password}=req.body

    // Validation of fields
    if(!email || !password){
      res.status(400).json({message:"Email and password are required"})
    }
    
    // check if user is aleady registerd?
    const existingUser = await userRepo.findOne({where:{email}})

    if(existingUser){
      res.status(409).json({message:"User already exists"})
      return
    }

    // hash passwords
    const salt=await bcrypt.genSalt(10)

    const hashedPassword= await bcrypt.hash(password,salt)

    // inserting new users
    const newUser= userRepo.create({name,email,passowrd:hashedPassword})

    await userRepo.save(newUser)

    res.status(201).json({message: "User registered successfully", userId: newUser})
  }
)