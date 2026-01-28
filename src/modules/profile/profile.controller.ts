import { Request, Response } from "express";
import { profileService } from "./profile.service";
import { role } from "better-auth/plugins";

const createProfile = async (req:Request, res:Response) => {
     try {
         if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized"
            })
        }
        const result = await profileService.createProfile(req.user);
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Profile creation failed",
            details: e
        })
    }
}


export const profileController = {
    createProfile
};