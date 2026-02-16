import express from 'express';
import { profileController } from './profile.controller';
import authChecker, { UserRole } from '../../middlewares/authChecker';
const router = express.Router();

// Public routes - browse tutors
router.get('/all-profiles', profileController.getAllTutorProfiles);
router.get('/tutors', profileController.getTutorProfiles);
router.get('/tutors/:id', profileController.getTutorById);

// Authenticated routes
router.post('/create-profile',authChecker(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), profileController.createProfile);
router.get('/me',authChecker(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), profileController.getProfile);
router.patch('/update-profile',authChecker(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), profileController.updateProfile);
export const profileRoutes = router;