import { AppDataSource } from "../Config/data-source";
import { User } from "../Entities/User";
import asyncHandler from "../Middlewares/asyncHandler";
import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { UserRequest } from "../Utils/Types/userTypes";
import { generateToken } from "../Utils/JWT(token)/generateToken";
import { Role } from "../Entities/Role";

const userRepo = AppDataSource.getRepository(User)
const roleRepo = AppDataSource.getRepository(Role)

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Destructure the body
    const { name, email, password, role_id } = req.body;
    
    // 2. Verify the inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    // 3. Validate if user exists
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    // 4. Validate the role
    const role = await roleRepo.findOne({ where: { role_id } });
    if (!role) {
      return res.status(400).json({ message: "Invalid role_id" });
    }
    

    // 5. Password hashing algorithm
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Instance of new user and save
    const newUser = userRepo.create({
      name,
      email,
      password: hashedPassword,
      role: role,
    });

    await userRepo.save(newUser);
    // 7. return the response
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.user_id,
      role: newUser.role.role_name,
    });
  }
);

// login User
export const loginUser = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    // 1. Check if user exists
    const user = await userRepo.findOne({
      where: { email },
      relations: ['role']
    })
    
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    // 2. Validate password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    // 3. Generate token and set cookie
    generateToken(res, user.user_id, user.role.role_id)

    // 4. Respond
    res.status(200).json({
      message: '✔ User logged in successfully',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role:user.role.role_name
      }
    })
  }
)

// Logout user
export const logoutUser = asyncHandler(
  async (req: UserRequest, res: Response) => {


    // set cookiees empty
    res.cookie("accessToken", " ", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      expires: new Date(0)
    });

    res.cookie("refreshToken", " ", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      expires: new Date(0)
    });
    res.status(200).json({ message: "User logged out successfully" });
  }
)