import express from 'express';
import { profileController } from './profile.controller';
import authChecker, { UserRole } from '../../middlewares/authChecker';
const router = express.Router();

router.get('/me', (req, res) => {
    res.send('User Profile');
});

router.post('/create-profile',authChecker(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), profileController.createProfile);
export const profileRoutes = router;