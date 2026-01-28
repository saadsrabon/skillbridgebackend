import { Request, Response } from "express";
import { profileService } from "./profile.service";
import { UserRole } from "../../middlewares/authChecker";

const createProfile = async (req:Request, res:Response) => {
     try {
         if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized"
            })
        }
        
        const data ={
           ...req.body,
           ...req.user,
        }
        
        const result = await profileService.createProfile(data);
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Profile creation failed",
            details: e
        })
    }
}

const getProfile = async (req:Request, res:Response) => {
    console.log("GetProfile called");
    try {
        if (!req.user) {
              return res.status(401).json({
                error: "Unauthorized"
            })
        }
        const userId = req.user.id;
        const roleType = req.user.role as string as UserRole;
        const profile = await profileService.getProfileByUserId(userId, roleType);
        res.status(200).json(profile);
    } catch (e) {
        res.status(400).json({
            error: "Failed to fetch profile",
            details: e
        })
    }
}
export const profileController = {
    createProfile,
    getProfile
};