import express from 'express';
import { profileController } from './profile.controller';
import authChecker, { UserRole } from '../../middlewares/authChecker';
const router = express.Router();


router.post('/create-profile',authChecker(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), profileController.createProfile);
router.get('/me',authChecker(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), profileController.getProfile);
export const profileRoutes = router;