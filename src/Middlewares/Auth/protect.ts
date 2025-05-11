import { Request,Response,NextFunction } from "express";
import asyncHandler from "../asyncHandler";
import jwt from 'jsonwebtoken'
import { UserRequest } from "../../Utils/Types/userTypes";
import { AppDataSource } from "../../Config/data-source";
import { User } from "../../Entities/User";

export const protect=asyncHandler( async(req:UserRequest,res:Response,next:NextFunction)=>{

  let token = req.cookies["accessToken"];
 // Only get token from cookies
  if (!process.env.JWT_SECRET) {
    throw new Error("No JWT secret provided");
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded=jwt.verify(token,process.env.JWT_SECRET) as {userId:string}

      // Fetch User from the db
      
      const userRepository=AppDataSource.getRepository(User)

      const user=await userRepository.findOne({where:{user_id: Number(decoded.userId)}})

      if(!user){
        res.status(404).json({message:"user not found"})
        return
      }

      req.user = { ...user, user_id: user.user_id.toString() }
      next();
      
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
})