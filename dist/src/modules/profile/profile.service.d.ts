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
interface TutorFilters {
    q?: string;
    subjectId?: string;
    minRate?: number;
    maxRate?: number;
    minRating?: number;
    sort?: 'rating' | 'rate_asc' | 'rate_desc' | 'experience';
    page?: number;
    limit?: number;
}
export declare const profileService: {
    createProfile: (data: ProfileData) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
    } | undefined>;
    getProfileByUserId: (userId: string, roleType: UserRole) => Promise<{
        role: import("../../../generated/prisma/enums").Role | null;
        phone: string | null;
        status: import("../../../generated/prisma/enums").UserStatus | null;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        image: string | null;
        emailVerified: boolean;
    } | null | undefined>;
    updateProfileByUserId: (userId: string, data: Partial<ProfileData>, roleType: UserRole) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
    } | undefined>;
    getAllTutorProfiles: () => Promise<({
        tutorProfile: ({
            tutorSubjects: ({
                subject: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    slug: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tutorId: string;
                subjectId: string;
            })[];
            availabilitySlots: {
                id: string;
                createdAt: Date;
                tutorId: string;
                startTime: Date;
                endTime: Date;
                isBooked: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            experience: number | null;
            bio: string | null;
            headline: string | null;
            hourlyRate: number | null;
            ratings: number | null;
            reviewscount: number | null;
        }) | null;
    } & {
        role: import("../../../generated/prisma/enums").Role | null;
        phone: string | null;
        status: import("../../../generated/prisma/enums").UserStatus | null;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        image: string | null;
        emailVerified: boolean;
    })[]>;
    getTutorProfiles: (filters: TutorFilters) => Promise<{
        data: ({
            tutorProfile: ({
                tutorSubjects: ({
                    subject: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        slug: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    tutorId: string;
                    subjectId: string;
                })[];
                reviews: ({
                    student: {
                        user: {
                            name: string;
                        };
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    rating: number;
                    bookingId: string;
                    studentId: string;
                    tutorId: string;
                    comment: string | null;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                experience: number | null;
                bio: string | null;
                headline: string | null;
                hourlyRate: number | null;
                ratings: number | null;
                reviewscount: number | null;
            }) | null;
        } & {
            role: import("../../../generated/prisma/enums").Role | null;
            phone: string | null;
            status: import("../../../generated/prisma/enums").UserStatus | null;
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string | null;
            emailVerified: boolean;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getTutorById: (id: string) => Promise<({
        user: {
            phone: string | null;
            email: string;
            name: string;
            image: string | null;
        };
        tutorSubjects: ({
            subject: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tutorId: string;
            subjectId: string;
        })[];
        availabilitySlots: {
            id: string;
            createdAt: Date;
            tutorId: string;
            startTime: Date;
            endTime: Date;
            isBooked: boolean;
        }[];
        reviews: ({
            student: {
                user: {
                    name: string;
                    image: string | null;
                };
            };
        } & {
            id: string;
            createdAt: Date;
            rating: number;
            bookingId: string;
            studentId: string;
            tutorId: string;
            comment: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        experience: number | null;
        bio: string | null;
        headline: string | null;
        hourlyRate: number | null;
        ratings: number | null;
        reviewscount: number | null;
    }) | null>;
};
export {};
//# sourceMappingURL=profile.service.d.ts.map