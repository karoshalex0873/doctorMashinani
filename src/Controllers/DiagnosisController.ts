import { Response, NextFunction } from "express";
import asyncHandler from "../Middlewares/asyncHandler";
import { UserRequest } from "../Utils/Types/userTypes";
import { AppDataSource } from "../Config/data-source";
import { SymptomEntry } from "../Entities/SymptomEntry";
import { GoogleGenerativeAI, } from '@google/generative-ai'



const symptomRepo = AppDataSource.getRepository(SymptomEntry)

// google gen AI defination
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const diagnose = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { symptomId } = req.params;
    const userID = req.user?.user_id;

    if (!userID) return res.status(401).json({ message: "Unauthorized access" });

    const symptomEntry = await symptomRepo.findOne({
      where: {
        entry_id: parseInt(symptomId),
        user: { user_id: Number(userID) }
      }
    });

    if (!symptomEntry) return res.status(404).json({ message: "Symptom entry not found" });

    const symptomText = symptomEntry.description; 

    const prompt = `
As a medical expert, analyze these symptoms and:
1. List potential diagnoses by likelihood
2. For each condition, provide:
   - FDA-approved medications with exact dosages
   - Administration details (form, frequency, max daily dose)
   - Prescription requirements
3. Include clinical red flags requiring emergency care

Return ONLY valid JSON format:
{
  "potential_conditions": [{
    "condition": "Condition name",
    "medications": [{
      "name": "Generic name",
      "dosage": "Exact mg/mcg",
      "frequency": "Dosing interval",
      "max_daily": "Max daily limit",
      "form": "Tablet/injection/etc",
      "prescription_required": boolean
    }]
  }],
  "clinical_notes": ["string"],
  "red_flags": [{
    "warning": "Emergency warning",
    "action": "Required response"
  }]
}

Symptoms: ${symptomText}

Medical Guidelines to Follow:
- Use 2024 WHO/CDC treatment protocols
- Include both OTC and prescription options
- Specify exact dosages for adults (18-65)
- Flag nephrotoxic/hepatotoxic medications
- List brand names in parentheses when critical
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response to extract JSON
      const jsonString = text.replace(/```json|```/g, '').trim();
      const diagnosisData = JSON.parse(jsonString);

      res.status(200).json({
        symptom: symptomEntry,
        diagnosis: diagnosisData,
      });
      
    } catch (error) {
      return res.status(500).json({
        message: "Error processing diagnosis",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);