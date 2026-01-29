import { prisma } from '../../lib/prisma';

interface SubjectData {
  name: string;
  slug: string;
}

const createSubject = async (data: SubjectData) => {
  const existing = await prisma.subject.findFirst({
  where: {
  OR: [
    { slug: data.slug },
    { name: data.name },
  ],
}
});

if (existing) {
  throw new Error('Subject with this slug or name already exists');
}
    const result = await prisma.subject.create({
    data:{
      name: data.name,
      slug: data.slug
    }
  });
  return result;
};

const getAllSubjects = async () => {
  return await prisma.subject.findMany({
    include: {
      tutorCategories: true,
    },
  });
};

const getSubjectById = async (id: string) => {
  return await prisma.subject.findUnique({
    where: { id },
    include: {
      tutorCategories: {
        include: {
          tutor: true,
        },
      },
    },
  });
};

const updateSubject = async (id: string, data: Partial<SubjectData>) => {
  return await prisma.subject.update({
    where: { id },
    data,
    include: {
      tutorCategories: true,
    },
  });
};

const deleteSubject = async (id: string) => {
  return await prisma.subject.delete({
    where: { id },
  });
};

const assignSubjectToTutor = async (tutorId: string, subjectId: string) => {
  return await prisma.tutorSubject.create({
    data: {
      tutorId,
      subjectId,
    },
    include: {
      tutor: true,
      subject: true,
    },
  });
};

const removeSubjectFromTutor = async (tutorId: string, subjectId: string) => {
  return await prisma.tutorSubject.deleteMany({
    where: {
      tutorId,
      subjectId,
    },
  });
};

///need one api to show the teacher who have his subjects assigned
const getAllSubjectsOfTutor = async (tutorId: string) => {
  return await prisma.tutorSubject.findMany({
    where: { tutorId },
    include: {
      subject: true,
    },
  });
};

export const subjectService = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  assignSubjectToTutor,
  removeSubjectFromTutor,
  getAllSubjectsOfTutor,
};
