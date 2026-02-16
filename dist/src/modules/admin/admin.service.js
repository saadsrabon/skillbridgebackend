import { prisma } from '../../lib/prisma';
import { Role, UserStatus } from '../../../generated/prisma/client';
/**
 * Get all users with filtering and pagination
 */
export const getAllUsers = async (filters) => {
    try {
        const { q, role, status, page = 1, limit = 20 } = filters;
        const skip = (page - 1) * limit;
        // Build where clause
        const where = {};
        // Search query (name, email)
        if (q) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } }
            ];
        }
        // Role filter
        if (role) {
            where.role = role;
        }
        // Status filter
        if (status) {
            where.status = status;
        }
        // Get total count
        const total = await prisma.user.count({ where });
        // Get users
        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                phone: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        });
        return {
            success: true,
            data: {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
};
/**
 * Get user details by ID
 */
export const getUserById = async (userId) => {
    try {
        if (!userId || typeof userId !== 'string') {
            return {
                success: false,
                error: 'Valid user ID is required',
            };
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: true,
                tutorProfile: {
                    include: {
                        tutorSubjects: {
                            include: {
                                subject: true
                            }
                        }
                    }
                }
            }
        });
        if (!user) {
            return {
                success: false,
                error: 'User not found',
            };
        }
        return {
            success: true,
            data: user,
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
};
/**
 * Update user status (ACTIVE, SUSPENDED, BANNED)
 */
export const updateUserStatus = async (userId, status) => {
    try {
        if (!userId || typeof userId !== 'string') {
            return {
                success: false,
                error: 'Valid user ID is required',
            };
        }
        if (!status || !Object.values(UserStatus).includes(status)) {
            return {
                success: false,
                error: `Valid status is required. Allowed values: ${Object.values(UserStatus).join(', ')}`,
            };
        }
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return {
                success: false,
                error: 'User not found',
            };
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { status },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                updatedAt: true,
            }
        });
        return {
            success: true,
            data: updatedUser,
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to update user status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
};
/**
 * Update user role (STUDENT, TUTOR, ADMIN)
 */
export const updateUserRole = async (userId, role) => {
    try {
        if (!userId || typeof userId !== 'string') {
            return {
                success: false,
                error: 'Valid user ID is required',
            };
        }
        if (!role || !Object.values(Role).includes(role)) {
            return {
                success: false,
                error: `Valid role is required. Allowed values: ${Object.values(Role).join(', ')}`,
            };
        }
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return {
                success: false,
                error: 'User not found',
            };
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                updatedAt: true,
            }
        });
        return {
            success: true,
            data: updatedUser,
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to update user role: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
};
//# sourceMappingURL=admin.service.js.map