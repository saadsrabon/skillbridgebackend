import express from 'express';
import { profileController } from './profile.controller';
import authChecker, { UserRole } from '../../middlewares/authChecker';
const router = express.Router();


router.post('/create-profile',authChecker(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), profileController.createProfile);
router.get('/me',authChecker(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), profileController.getProfile);
router.put('/update-profile',authChecker(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), profileController.updateProfile);
export const profileRoutes = router;