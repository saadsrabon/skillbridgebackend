import { prisma } from '../../lib/prisma';

interface SubjectData {
  name: string;
  slug: string;
}

const createSubject = async (data: SubjectData) => {
  return await prisma.subject.create({
    data,
  });
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

export const subjectService = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  assignSubjectToTutor,
  removeSubjectFromTutor,
};
