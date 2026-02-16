import { prisma } from "../../lib/prisma";
const createProfile = async (data) => {
    console.log("Creating profile with data:", data);
    if (data.role === 'TUTOR') {
        const profile = await prisma.tutorProfile.create({
            data: {
                userId: data.id,
                bio: data?.bio || 'Default bio',
                headline: data?.headline || 'Default headline',
                hourlyRate: data?.hourlyRate || 0,
                experience: data?.experience || 0,
            }
        });
        return profile;
    }
    else if (data.role === 'STUDENT') {
        const profile = await prisma.studentProfile.create({
            data: {
                userId: data.id,
                bio: data?.bio || 'Default bio',
            }
        });
        return profile;
    }
};
const getProfileByUserId = async (userId, roleType) => {
    console.log("Fetching profile for userId:", userId, "with role:", roleType);
    if (roleType === 'TUTOR') {
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
    else if (roleType === 'STUDENT') {
        return await prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true }
        });
    }
    else if (roleType === 'ADMIN') {
        return await prisma.user.findUnique({
            where: { id: userId },
        });
    }
};
const updateProfileByUserId = async (userId, data, roleType) => {
    if (roleType === 'TUTOR') {
        return await prisma.tutorProfile.update({
            where: { userId },
            data
        });
    }
    else if (roleType === 'STUDENT') {
        return await prisma.studentProfile.update({
            where: { userId },
            data
        });
    }
};
// Public tutor browsing - legacy endpoint
const getAllTutorProfiles = async () => {
    return await prisma.user.findMany({
        where: {
            role: 'TUTOR',
            tutorProfile: {
                isNot: null
            }
        },
        include: {
            tutorProfile: {
                include: {
                    tutorSubjects: {
                        include: {
                            subject: true
                        }
                    },
                    availabilitySlots: {
                        where: {
                            isBooked: false
                        }
                    }
                }
            }
        }
    });
};
const getTutorProfiles = async (filters) => {
    const { q, subjectId, minRate, maxRate, minRating, sort = 'rating', page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    // Build where clause
    const where = {
        role: 'TUTOR',
        tutorProfile: {
            isNot: null
        }
    };
    // Search query (name, bio, headline)
    if (q) {
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { tutorProfile: { bio: { contains: q, mode: 'insensitive' } } },
            { tutorProfile: { headline: { contains: q, mode: 'insensitive' } } }
        ];
    }
    // Subject filter
    if (subjectId) {
        where.tutorProfile = {
            ...where.tutorProfile,
            tutorSubjects: {
                some: {
                    subjectId: subjectId
                }
            }
        };
    }
    // Rate filters
    if (minRate !== undefined || maxRate !== undefined) {
        where.tutorProfile = {
            ...where.tutorProfile,
            hourlyRate: {}
        };
        if (minRate !== undefined) {
            where.tutorProfile.hourlyRate.gte = minRate;
        }
        if (maxRate !== undefined) {
            where.tutorProfile.hourlyRate.lte = maxRate;
        }
    }
    // Rating filter
    if (minRating !== undefined) {
        where.tutorProfile = {
            ...where.tutorProfile,
            ratings: {
                gte: minRating
            }
        };
    }
    // Build orderBy clause
    let orderBy = {};
    switch (sort) {
        case 'rating':
            orderBy = { tutorProfile: { ratings: 'desc' } };
            break;
        case 'rate_asc':
            orderBy = { tutorProfile: { hourlyRate: 'asc' } };
            break;
        case 'rate_desc':
            orderBy = { tutorProfile: { hourlyRate: 'desc' } };
            break;
        case 'experience':
            orderBy = { tutorProfile: { experience: 'desc' } };
            break;
        default:
            orderBy = { tutorProfile: { ratings: 'desc' } };
    }
    // Get total count
    const total = await prisma.user.count({ where });
    // Get tutors
    const tutors = await prisma.user.findMany({
        where,
        include: {
            tutorProfile: {
                include: {
                    tutorSubjects: {
                        include: {
                            subject: true
                        }
                    },
                    reviews: {
                        take: 5,
                        orderBy: {
                            createdAt: 'desc'
                        },
                        include: {
                            student: {
                                select: {
                                    user: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy,
        skip,
        take: limit
    });
    return {
        data: tutors,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
const getTutorById = async (id) => {
    return await prisma.tutorProfile.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                    phone: true
                }
            },
            tutorSubjects: {
                include: {
                    subject: true
                }
            },
            availabilitySlots: {
                where: {
                    isBooked: false
                }
            },
            reviews: {
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    student: {
                        select: {
                            user: {
                                select: {
                                    name: true,
                                    image: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
};
export const profileService = {
    createProfile,
    getProfileByUserId,
    updateProfileByUserId,
    getAllTutorProfiles,
    getTutorProfiles,
    getTutorById
};
//# sourceMappingURL=profile.service.js.map