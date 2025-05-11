import { Response, NextFunction } from "express";
import asyncHandler from "../Middlewares/asyncHandler";
import { UserRequest } from "../Utils/Types/userTypes";
import { AppDataSource } from "../Config/data-source";
import { SymptomEntry } from "../Entities/SymptomEntry";
import { User } from "../Entities/User";

const symptomRepo = AppDataSource.getRepository(SymptomEntry);
const userRepo = AppDataSource.getRepository(User);

export const symptomEntry = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { description } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Please describe your issue" });
    }

    // 2. Get patient's profile
    const user = await userRepo.findOne({
      where: { user_id: req.user?.user_id ? Number(req.user.user_id) : undefined },
    });

    if (!user) {
      res.status(404).json({ message: "Patient profile not found" });
      return
    }

    // 3. Save symptom entry
    const symptom = symptomRepo.create({
      description,
      user,
    });

    await symptomRepo.save(symptom);

    res.status(201).json({
      message: "Symptom entry saved successfully",
      entry: symptom,
    });
  }
);
