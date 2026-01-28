import { Request, Response } from "express";
import { subjectService } from "./subject.service";

const createSubject = async (req: Request, res: Response) => {
    try {
        // Logic to create a subject
        const subject = await subjectService.createSubject(req.body);
        res.status(201).json({ message: 'Subject created' , subject});
    } catch (e) {
        res.status(400).json({
            error: "Subject creation failed",
            details: e
        })
    }
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