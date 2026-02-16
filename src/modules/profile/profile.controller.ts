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

const updateProfile = async (req:Request, res:Response) => {
    try {
        if (!req.user) {
              return res.status(401).json({
                error: "Unauthorized"
            })
        }
        const userId = req.user.id;
        const roleType = req.user.role as string as UserRole;
        const updateData = req.body;
        const updatedProfile = await profileService.updateProfileByUserId(userId, updateData, roleType);
        res.status(200).json(updatedProfile);
    } catch (e) {
        res.status(400).json({
            error: "Failed to update profile",
            details: e
        })
    }
}

// Public endpoint - browse all tutors (legacy)
const getAllTutorProfiles = async (req: Request, res: Response) => {
    try {
        const tutors = await profileService.getAllTutorProfiles();
        res.status(200).json({
            success: true,
            data: tutors
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch tutors",
            details: e
        });
    }
}

// Public endpoint - browse tutors with filters
const getTutorProfiles = async (req: Request, res: Response) => {
    try {
        const {
            q,
            subjectId,
            minRate,
            maxRate,
            minRating,
            sort,
            page,
            limit
        } = req.query;

        const filters: any = {};
        if (q) filters.q = q as string;
        if (subjectId) filters.subjectId = subjectId as string;
        if (minRate) filters.minRate = parseFloat(minRate as string);
        if (maxRate) filters.maxRate = parseFloat(maxRate as string);
        if (minRating) filters.minRating = parseFloat(minRating as string);
        if (sort) filters.sort = sort as 'rating' | 'rate_asc' | 'rate_desc' | 'experience';
        if (page) filters.page = parseInt(page as string);
        if (limit) filters.limit = parseInt(limit as string);

        const result = await profileService.getTutorProfiles(filters);
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch tutors",
            details: e
        });
    }
}

const getTutorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await profileService.getTutorById(id as string);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Tutor profile not found"
            });
        }

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch tutor profile",
            details: e
        });
    }
}

export const profileController = {
    createProfile,
    getProfile,
    updateProfile,
    getAllTutorProfiles,
    getTutorProfiles,
    getTutorById
};