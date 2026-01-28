import { Request } from "express";
import { prisma } from "../../lib/prisma";
import { role } from 'better-auth/plugins';
import { UserRole } from "../../middlewares/authChecker";

interface ProfileData {
    id: string;
    bio?: string;
    isVerified?: boolean;
    headline?: string;
    hourlyRate?: number;
    experience?: number;
    role?: string;
    email: string;
}
    

const createProfile = async (data: ProfileData) => {
    console.log("Creating profile with data:", data);
    
 if(data.role === 'TUTOR'){
    const profile = await prisma.tutorProfile.create({
        data: {
            userId: data.id,
            bio: data?.bio || 'Default bio',
            headline: data?.headline || 'Default headline',
            hourlyRate: data?.hourlyRate || 0,
            experience: data?.experience || 0,
        
        }
    })
    return profile
}
else if(data.role === 'STUDENT'){
    const profile = await prisma.studentProfile.create({
        data: {
            userId: data.id,
            bio: data?.bio || 'Default bio',
        }
    })
return profile
}
}

const getProfileByUserId = async (userId: string, roleType: UserRole) => {
    console.log("Fetching profile for userId:", userId, "with role:", roleType);
    if(roleType === 'TUTOR'){
        return await prisma.user.findUnique({
            where: { id: userId },
            include: { tutorProfile: {
                select: {
                    bio: true,
                    headline: true,
                    hourlyRate: true,
                    experience: true,
                    ratings: true,
                    reviewscount: true
                }
            } }

        });
    }
    else if(roleType === 'STUDENT'){
        return await prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true }
        });
    }else if(roleType === 'ADMIN'){
        return await prisma.user.findUnique({
            where: { id: userId },
        });
    }
}
const updateProfileByUserId = async (userId: string, data: Partial<ProfileData>, roleType: UserRole) => {
    if(roleType === 'TUTOR'){
        return await prisma.tutorProfile.update({
            where: { userId },
            data
        });
    }
    else if(roleType === 'STUDENT'){
        return await prisma.studentProfile.update({
            where: { userId },
            data
        });
    }
}

export const profileService = {
    createProfile,
    getProfileByUserId,
    updateProfileByUserId
};