import { Request, Response } from 'express';
import { Role, UserStatus } from '../../../generated/prisma/client';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
} from './admin.service';

/**
 * Get all users with filters
 * GET /admin/users
 */
export const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, role, status, page, limit } = req.query;

    // Validate role if provided
    if (role && !Object.values(Role).includes(role as Role)) {
      res.status(400).json({
        success: false,
        error: `Invalid role. Allowed values: ${Object.values(Role).join(', ')}`,
      });
      return;
    }

    // Validate status if provided
    if (status && !Object.values(UserStatus).includes(status as UserStatus)) {
      res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${Object.values(UserStatus).join(', ')}`,
      });
      return;
    }

    const filters: any = {};
    if (q) filters.q = q as string;
    if (role) filters.role = role as Role;
    if (status) filters.status = status as UserStatus;
    if (page) filters.page = parseInt(page as string);
    if (limit) filters.limit = parseInt(limit as string);

    const result = await getAllUsers(filters);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

/**
 * Get user details by ID
 * GET /admin/users/:userId
 */
export const getUserByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
      return;
    }

    const result = await getUserById(userId as string);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

/**
 * Update user status
 * PATCH /admin/users/:userId/status
 */
export const updateUserStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
      return;
    }

    if (!status) {
      res.status(400).json({
        success: false,
        error: 'Status is required',
      });
      return;
    }

    if (!Object.values(UserStatus).includes(status as UserStatus)) {
      res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${Object.values(UserStatus).join(', ')}`,
      });
      return;
    }

    const result = await updateUserStatus(userId as string, status as UserStatus);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

/**
 * Update user role
 * PATCH /admin/users/:userId/role
 */
export const updateUserRoleController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
      return;
    }

    if (!role) {
      res.status(400).json({
        success: false,
        error: 'Role is required',
      });
      return;
    }

    if (!Object.values(Role).includes(role as Role)) {
      res.status(400).json({
        success: false,
        error: `Invalid role. Allowed values: ${Object.values(Role).join(', ')}`,
      });
      return;
    }

    const result = await updateUserRole(userId as string, role as Role);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};
