import { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async (req:Request, res:Response) => {
     try {
        console.log(req.user);
        const result = await profileService.createProfile(req.body);
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