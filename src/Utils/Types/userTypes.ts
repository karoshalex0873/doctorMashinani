import { Request } from "express";

export interface User{
  user_id:string,
  name:string,
  email:string,
  password?:string // excluded when retuning the user information
}
export interface UserRequest extends Request{
  user?:User
}