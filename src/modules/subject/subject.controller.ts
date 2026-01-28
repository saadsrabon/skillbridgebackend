import { Request, Response } from "express";

const createSubject = async (req: Request, res: Response) => {
    // Logic to create a subject
    res.status(201).json({ message: 'Subject created' });
};

const getAllSubjects = async (req: Request, res: Response) => {
    // Logic to get all subjects
    res.status(200).json({ subjects: [] });
};
const assignSubjectToTutor = async (req: Request, res: Response) => {
    // Logic to assign subject to tutor
    res.status(200).json({ message: 'Subject assigned to tutor' });
}
const removeSubjectFromTutor = async (req: Request, res: Response) => {
    // Logic to remove assign a subject from a tutor
    res.status(200).json({ subject: {} });
};
const deleteSubject = async (req: Request, res: Response) => {
    // Logic to delete a subject
    res.status(200).json({ message: 'Subject deleted' });
}
const updateSubjectDetails = async (req: Request, res: Response) => {
    // Logic to update subject details
    res.status(200).json({ message: 'Subject updated' });
}

export const subjectController = {
    createSubject,
    getAllSubjects,
    assignSubjectToTutor,
    removeSubjectFromTutor,
    deleteSubject,
    updateSubjectDetails
};