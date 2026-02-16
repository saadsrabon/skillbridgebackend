import { Request, Response } from 'express';
/**
 * Create a new availability slot
 * POST /api/availability/slots
 */
export declare const createSlot: (req: Request, res: Response) => Promise<void>;
/**
 * Update an availability slot
 * PATCH /api/availability/slots/:slotId
 */
export declare const editSlot: (req: Request, res: Response) => Promise<void>;
/**
 * Get all availability slots for a tutor
 * GET /api/availability/tutors/:tutorId/slots
 */
export declare const getTutorSlots: (req: Request, res: Response) => Promise<void>;
/**
 * Get a single availability slot by ID
 * GET /api/availability/slots/:slotId
 */
export declare const getSlotById: (req: Request, res: Response) => Promise<void>;
/**
 * Delete an availability slot
 * DELETE /api/availability/slots/:slotId
 */
export declare const deleteSlot: (req: Request, res: Response) => Promise<void>;
/**
 * Get available slots for a tutor within a date range
 * GET /api/availability/tutors/:tutorId/available?startDate=ISO&endDate=ISO
 */
export declare const getAvailableSlots: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=avialiblity.controller.d.ts.map