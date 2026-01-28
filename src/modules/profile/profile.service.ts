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
        return await prisma.tutorProfile.findUnique({
            where: { userId }
        });
    }
    else if(roleType === 'STUDENT'){
        return await prisma.studentProfile.findUnique({
            where: { userId }
        });
    }
}
const updateProfileByUserId = async (userId: string, data: Partial<ProfileData>, roleType: UserRole) => {
    console.log("Updating profile for userId:", userId, "with data:", data, "and role:", roleType);
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