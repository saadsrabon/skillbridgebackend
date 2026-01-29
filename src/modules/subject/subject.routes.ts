import express from 'express';
import authChecker, { UserRole } from '../../middlewares/authChecker';
import { subjectController } from './subject.controller';
const router = express.Router();

// Create a new subject (Admin and Tutor)
router.post(
  '/create-subject',
  authChecker(UserRole.ADMIN, UserRole.TUTOR),
  subjectController.createSubject
);

// Get all subjects (Public)
router.get('/subjects', subjectController.getAllSubjects);

// Get a specific subject by ID (Public)
router.get('/subject/:id', subjectController.getSubjectById);
//get all subjects of a tutor
router.get('/tutor-subjects/:tutorId', subjectController.getTutorssubjects);
// Assign subject to tutor (Admin and Tutor)
router.post(
  '/assign-subject',
  authChecker(UserRole.TUTOR, UserRole.ADMIN),
  subjectController.assignSubjectToTutor
);

// Update subject details (Admin and Tutor)
router.patch(
  '/update-subject/:id',
  authChecker(UserRole.ADMIN, UserRole.TUTOR),
  subjectController.updateSubjectDetails
);

// Remove subject from tutor (Admin and Tutor)
router.post(
  '/remove-subject',
  authChecker(UserRole.ADMIN, UserRole.TUTOR),
  subjectController.removeSubjectFromTutor
);

// Delete subject (Admin only)
router.delete('/delete-subject/:id', authChecker(UserRole.ADMIN), subjectController.deleteSubject);

export const subjectRoutes = router;
