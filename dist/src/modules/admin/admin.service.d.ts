import { Role, UserStatus } from '../../../generated/prisma/client';
interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
interface UserFilters {
    q?: string;
    role?: Role;
    status?: UserStatus;
    page?: number;
    limit?: number;
}
/**
 * Get all users with filtering and pagination
 */
export declare const getAllUsers: (filters: UserFilters) => Promise<ServiceResponse<any>>;
/**
 * Get user details by ID
 */
export declare const getUserById: (userId: string) => Promise<ServiceResponse<any>>;
/**
 * Update user status (ACTIVE, SUSPENDED, BANNED)
 */
export declare const updateUserStatus: (userId: string, status: UserStatus) => Promise<ServiceResponse<any>>;
/**
 * Update user role (STUDENT, TUTOR, ADMIN)
 */
export declare const updateUserRole: (userId: string, role: Role) => Promise<ServiceResponse<any>>;
export {};
//# sourceMappingURL=admin.service.d.ts.map