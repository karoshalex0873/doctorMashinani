import { Response,NextFunction } from "express";
import asyncHandler from "../Middlewares/asyncHandler";
import { UserRequest } from "../Utils/Types/userTypes";


export const diagnose= asyncHandler(
  async(req:UserRequest,res:Response,next:NextFunction)=>{
    
  }
)