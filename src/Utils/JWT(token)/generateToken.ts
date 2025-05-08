import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Response } from 'express'


dotenv.config()


export const generateToken=(res:Response,userId:string)=>{
  const jwt_secret=process.env.JWT_SECRET
  const refreshSecret=process.env.REFRESH_TOKEN_SECRET

  if(!jwt_secret || !refreshSecret){
    throw new Error("JWT secrets are not defined in envronment varibles")
  }

  try {
    // access Token 
    const accessToken=jwt.sign(
      {userId},
      jwt_secret,
      {expiresIn:"1d"}
    )
    // Refresh Token
    const refreshToken=jwt.sign(
      {userId},
      refreshSecret,
      {expiresIn:"30d"}
    )

    const maxAge = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAge
    })
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    })

    return{accessToken,refreshToken}
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw new Error("Token generation failed");
  }
}