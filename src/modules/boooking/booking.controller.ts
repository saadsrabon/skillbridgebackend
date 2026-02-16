import { Request, Response } from 'express';
import { BookingStatus } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import {
  createBooking,
  updateBookingStatus,
  getBookingById,
  getStudentBookings,
  getTutorBookings,
  cancelBooking,
  getBookingsInDateRange,
  createReview,
} from './booking.service';

/**
 * Create a new booking
 * POST /api/bookings
 */
export const createBookingController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tutorId, studentId, availableSlotId, price } = req.body;

    // Validate required fields
    if (!tutorId || !studentId || !availableSlotId || price === undefined) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: tutorId, studentId, availableSlotId, price',
      });
      return;
    }

    // Validate price is a number
    if (typeof price !== 'number') {
      res.status(400).json({
        success: false,
        error: 'Price must be a number',
      });
      return;
    }

    const result = await createBooking({
      tutorId,
      studentId,
      availableSlotId,
      price,
    });

    if (result.success) {
      res.status(201).json(result);
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
 * Update booking status
 * PATCH /api/bookings/:bookingId/status
 */
export const updateBookingStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        error: 'Booking ID is required',
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

    const result = await updateBookingStatus(bookingId as string, { status });

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
 * Get a booking by ID
 * GET /api/bookings/:bookingId
 */
export const getBookingByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        error: 'Booking ID is required',
      });
      return;
    }

    const result = await getBookingById(bookingId as string);

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
 * Get all bookings for a student
 * GET /api/bookings/student/:studentId
 * Query params: status (optional)
 */
export const getStudentBookingsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const { status } = req.query;

    if (!studentId) {
      res.status(400).json({
        success: false,
        error: 'Student ID is required',
      });
      return;
    }

    // Validate status if provided
    if (status && !Object.values(BookingStatus).includes(status as BookingStatus)) {
      res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${Object.values(BookingStatus).join(', ')}`,
      });
      return;
    }

    const result = await getStudentBookings(studentId as string, status as BookingStatus | undefined);

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
 * Get all bookings for a tutor
 * GET /api/bookings/tutor/:tutorId
 * Query params: status (optional)
 */
export const getTutorBookingsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tutorId } = req.params;
    const { status } = req.query;

    if (!tutorId) {
      res.status(400).json({
        success: false,
        error: 'Tutor ID is required',
      });
      return;
    }

    // Validate status if provided
    if (status && !Object.values(BookingStatus).includes(status as BookingStatus)) {
      res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${Object.values(BookingStatus).join(', ')}`,
      });
      return;
    }

    const result = await getTutorBookings(tutorId as string, status as BookingStatus | undefined);

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
 * Cancel a booking
 * DELETE /api/bookings/:bookingId/cancel
 */
export const cancelBookingController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        error: 'Booking ID is required',
      });
      return;
    }

    const result = await cancelBooking(bookingId as string);

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
 * Get bookings within a date range
 * GET /api/bookings/range
 * Query params: startDate, endDate, tutorId (optional), status (optional)
 */
export const getBookingsInDateRangeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { startDate, endDate, tutorId, status } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        error: 'startDate and endDate query parameters are required',
      });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Validate date format
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({
        success: false,
        error: 'Invalid date format. Use ISO 8601 format (e.g., 2026-01-30T14:00:00Z)',
      });
      return;
    }

    // Validate status if provided
    if (status && !Object.values(BookingStatus).includes(status as BookingStatus)) {
      res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${Object.values(BookingStatus).join(', ')}`,
      });
      return;
    }

    const result = await getBookingsInDateRange(
      start,
      end,
      tutorId as string | undefined,
      status as BookingStatus | undefined
    );

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
 * Create a review for a completed booking
 * POST /api/bookings/:bookingId/review
 */
export const createReviewController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        error: 'Booking ID is required',
      });
      return;
    }

    if (!rating || typeof rating !== 'number') {
      res.status(400).json({
        success: false,
        error: 'Rating is required and must be a number',
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5',
      });
      return;
    }

    // Get student ID from authenticated user
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    // Get student profile ID
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!studentProfile) {
      res.status(404).json({
        success: false,
        error: 'Student profile not found',
      });
      return;
    }

    const result = await createReview({
      bookingId: bookingId as string,
      studentId: studentProfile.id,
      rating,
      comment: comment || undefined,
    });

    if (result.success) {
      res.status(201).json(result);
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
