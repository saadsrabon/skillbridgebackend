import { NextFunction, Request, Response } from "express";
export declare enum UserRole {
    ADMIN = "ADMIN",
    TUTOR = "TUTOR",
    STUDENT = "STUDENT"
}
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            };
        }
    }
}
declare const authChecker: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default authChecker;
//# sourceMappingURL=authChecker.d.ts.map