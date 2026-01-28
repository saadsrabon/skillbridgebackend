import { prisma } from "../../lib/prisma";


interface SubjectData { 
    name: string;
    slug: string;
}
const createSubject = async (data: SubjectData) => {
    return await prisma.subject.create({
        data
    });
}


export const subjectService = {
    createSubject,
};