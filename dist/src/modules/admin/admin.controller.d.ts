import { Request, Response } from 'express';
/**
 * Get all users with filters
 * GET /admin/users
 */
export declare const getAllUsersController: (req: Request, res: Response) => Promise<void>;
/**
 * Get user details by ID
 * GET /admin/users/:userId
 */
export declare const getUserByIdController: (req: Request, res: Response) => Promise<void>;
/**
 * Update user status
 * PATCH /admin/users/:userId/status
 */
export declare const updateUserStatusController: (req: Request, res: Response) => Promise<void>;
/**
 * Update user role
 * PATCH /admin/users/:userId/role
 */
export declare const updateUserRoleController: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map