import { prisma } from "../../lib/prisma";

const createProfile = async (data:any) => {
   
//logic to create user on
const profile = await prisma.studentProfile.create({
    data:{
        userId: data.userId,
        bio: data.bio,
        
       
    }
})
return profile
}


export const profileService = {
    createProfile
};