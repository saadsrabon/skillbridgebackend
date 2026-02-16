import { Request, Response } from 'express';
/**
 * Create a new booking
 * POST /api/bookings
 */
export declare const createBookingController: (req: Request, res: Response) => Promise<void>;
/**
 * Update booking status
 * PATCH /api/bookings/:bookingId/status
 */
export declare const updateBookingStatusController: (req: Request, res: Response) => Promise<void>;
/**
 * Get a booking by ID
 * GET /api/bookings/:bookingId
 */
export declare const getBookingByIdController: (req: Request, res: Response) => Promise<void>;
/**
 * Get all bookings for a student
 * GET /api/bookings/student/:studentId
 * Query params: status (optional)
 */
export declare const getStudentBookingsController: (req: Request, res: Response) => Promise<void>;
/**
 * Get all bookings for a tutor
 * GET /api/bookings/tutor/:tutorId
 * Query params: status (optional)
 */
export declare const getTutorBookingsController: (req: Request, res: Response) => Promise<void>;
/**
 * Cancel a booking
 * DELETE /api/bookings/:bookingId/cancel
 */
export declare const cancelBookingController: (req: Request, res: Response) => Promise<void>;
/**
 * Get bookings within a date range
 * GET /api/bookings/range
 * Query params: startDate, endDate, tutorId (optional), status (optional)
 */
export declare const getBookingsInDateRangeController: (req: Request, res: Response) => Promise<void>;
/**
 * Create a review for a completed booking
 * POST /api/bookings/:bookingId/review
 */
export declare const createReviewController: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=booking.controller.d.ts.map