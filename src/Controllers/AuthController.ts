import { AppDataSource } from "../Config/data-source";
import { User } from "../Entities/User";
import asyncHandler from "../Middlewares/asyncHandler";
import { NextFunction, Request,Response } from "express";
import bcrypt from 'bcryptjs';
import { UserRequest } from "../Utils/Types/userTypes";
import { generateToken } from "../Utils/JWT(token)/generateToken";

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
    const newUser= userRepo.create({name,email,passoword:hashedPassword})

    await userRepo.save(newUser)

    res.status(201).json({message: "User registered successfully", userId: newUser})
  }
)

// login User

export const loginUser = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body 

    // 1. Check if user exists
    const user = await userRepo.findOneBy({ email })
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    // 2. Validate password
    const isValid = await bcrypt.compare(password, user.passoword) 
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    // 3. Generate token and set cookie
    generateToken(res, user.user_id)

    // 4. Respond
    res.status(200).json({
      message: '✔ User logged in successfully',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email
      }
    })
  }
)

// Logout user
export const logoutUser=asyncHandler(
  async(req:UserRequest,res:Response)=>{
    

    // set cookiees empty
    res.cookie("accessToken"," ",{
      httpOnly:true,
      secure:process.env.NODE_ENV !== "development",
      sameSite:"strict",
      expires:new Date(0) 
    });

    res.cookie("refreshToken"," ",{
      httpOnly:true,
      secure:process.env.NODE_ENV !== "development",
      sameSite:"strict",
      expires:new Date(0) 
    });
    res.status(200).json({ message: "User logged out successfully" });
  }
)