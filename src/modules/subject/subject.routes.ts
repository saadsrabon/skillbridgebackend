import express from 'express';
import authChecker, { UserRole } from '../../middlewares/authChecker';
import { subjectController } from './subject.controller';
const router = express.Router()
//add comment for all routes

router.post('/create-subject',authChecker(UserRole.ADMIN, UserRole.TUTOR),subjectController.createSubject);

router.get('/subjects', subjectController.getAllSubjects);

router.post('/assign-subject',authChecker(UserRole.TUTOR, UserRole.ADMIN), subjectController.assignSubjectToTutor);
router.patch('/update-subject/:id',authChecker(UserRole.ADMIN, UserRole.TUTOR), subjectController.updateSubjectDetails);

router.delete('/delete-subject/:id',authChecker(UserRole.ADMIN), subjectController.deleteSubject);


router.get('/subject/:id', subjectController.removeSubjectFromTutor);

export const subjectRoutes = router;