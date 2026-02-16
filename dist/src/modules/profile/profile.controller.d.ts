import { Request, Response } from "express";
export declare const profileController: {
    createProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllTutorProfiles: (req: Request, res: Response) => Promise<void>;
    getTutorProfiles: (req: Request, res: Response) => Promise<void>;
    getTutorById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=profile.controller.d.ts.map