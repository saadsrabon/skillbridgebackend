interface SubjectData {
    name: string;
    slug: string;
}
export declare const subjectService: {
    createSubject: (data: SubjectData) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }>;
    getAllSubjects: () => Promise<({
        tutorCategories: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tutorId: string;
            subjectId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    })[]>;
    getSubjectById: (id: string) => Promise<({
        tutorCategories: ({
            tutor: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tutorId: string;
            subjectId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }) | null>;
    updateSubject: (id: string, data: Partial<SubjectData>) => Promise<{
        tutorCategories: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tutorId: string;
            subjectId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }>;
    deleteSubject: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }>;
    assignSubjectToTutor: (tutorId: string, subjectId: string) => Promise<{
        subject: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        };
        tutor: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tutorId: string;
        subjectId: string;
    }>;
    removeSubjectFromTutor: (tutorId: string, subjectId: string) => Promise<import("../../../generated/prisma/internal/prismaNamespace").BatchPayload>;
    getAllSubjectsOfTutor: (tutorId: string) => Promise<({
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
    })[]>;
};
export {};
//# sourceMappingURL=subject.service.d.ts.map