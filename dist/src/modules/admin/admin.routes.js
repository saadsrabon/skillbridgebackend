import express from 'express';
import { getAllUsersController, getUserByIdController, updateUserStatusController, updateUserRoleController, } from './admin.controller';
import authChecker, { UserRole } from '../../middlewares/authChecker';
const router = express.Router();
// All admin routes require ADMIN role
router.get('/users', authChecker(UserRole.ADMIN), getAllUsersController);
router.get('/users/:userId', authChecker(UserRole.ADMIN), getUserByIdController);
router.patch('/users/:userId/status', authChecker(UserRole.ADMIN), updateUserStatusController);
router.patch('/users/:userId/role', authChecker(UserRole.ADMIN), updateUserRoleController);
export const adminRoutes = router;
//# sourceMappingURL=admin.routes.js.map