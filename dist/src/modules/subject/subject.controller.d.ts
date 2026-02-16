import { Request, Response } from 'express';
export declare const subjectController: {
    createSubject: (req: Request, res: Response) => Promise<void>;
    getAllSubjects: (req: Request, res: Response) => Promise<void>;
    getSubjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    assignSubjectToTutor: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    removeSubjectFromTutor: (req: Request, res: Response) => Promise<void>;
    deleteSubject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateSubjectDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getTutorssubjects: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=subject.controller.d.ts.map