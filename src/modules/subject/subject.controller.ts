import { Request, Response } from 'express';
import { subjectService } from './subject.service';

const createSubject = async (req: Request, res: Response) => {
  try {
    const subject = await subjectService.createSubject(req.body);
    res.status(201).json({
      message: 'Subject created successfully',
      subject,
    });
  } catch (e: any) {
    res.status(400).json({
      error: 'Subject creation failed',
      details: e.message,
    });
  }
};

const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await subjectService.getAllSubjects();
    res.status(200).json({
      message: 'Subjects retrieved successfully',
      subjects,
    });
  } catch (e: any) {
    res.status(400).json({
      error: 'Failed to retrieve subjects',
      details: e.message,
    });
  }
};

const getSubjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid subject ID' });
    }
    const subject = await subjectService.getSubjectById(id);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.status(200).json({
      message: 'Subject retrieved successfully',
      subject,
    });
  } catch (e: any) {
    res.status(400).json({
      error: 'Failed to retrieve subject',
      details: e.message,
    });
  }
};

const assignSubjectToTutor = async (req: Request, res: Response) => {
  try {
    const { tutorId, subjectId } = req.body;
    const assignment = await subjectService.assignSubjectToTutor(tutorId, subjectId);
    res.status(201).json({
      message: 'Subject assigned to tutor successfully',
      assignment,
    });
  } catch (e: any) {
    res.status(400).json({
      error: 'Failed to assign subject to tutor',
      details: e.message,
    });
  }
};

const removeSubjectFromTutor = async (req: Request, res: Response) => {
  try {
    const { tutorId, subjectId } = req.body;
    await subjectService.removeSubjectFromTutor(tutorId, subjectId);
    res.status(200).json({
      message: 'Subject removed from tutor successfully',
    });
  } catch (e: any) {
    res.status(400).json({
      error: 'Failed to remove subject from tutor',
      details: e.message,
    });
  }
};

const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid subject ID' });
    }
    await subjectService.deleteSubject(id);
    res.status(200).json({
      message: 'Subject deleted successfully',
    });
  } catch (e: any) {
    res.status(400).json({
      error: 'Failed to delete subject',
      details: e.message,
    });
  }
};

const updateSubjectDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid subject ID' });
    }
    const subject = await subjectService.updateSubject(id, req.body);
    res.status(200).json({
      message: 'Subject updated successfully',
      subject,
    });
  } catch (e: any) {
    res.status(400).json({
      error: 'Failed to update subject',
      details: e.message,
    });
  }
};

export const subjectController = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  assignSubjectToTutor,
  removeSubjectFromTutor,
  deleteSubject,
  updateSubjectDetails,
};
