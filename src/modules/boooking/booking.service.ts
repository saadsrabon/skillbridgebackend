import { Booking, BookingStatus } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

// Type for create booking request
interface CreateBookingRequest {
  tutorId: string;
  studentId: string;
  availableSlotId: string;
  price: number;
}

// Type for update booking status request
interface UpdateBookingStatusRequest {
  status: BookingStatus;
}

// Response type
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate booking request data
 */
const validateBookingRequest = (data: CreateBookingRequest): string | null => {
  if (!data.tutorId || typeof data.tutorId !== 'string') {
    return 'Valid tutorId is required';
  }

  if (!data.studentId || typeof data.studentId !== 'string') {
    return 'Valid studentId is required';
  }

  if (!data.availableSlotId || typeof data.availableSlotId !== 'string') {
    return 'Valid availableSlotId is required';
  }

  if (typeof data.price !== 'number' || data.price < 0) {
    return 'Price must be a non-negative number';
  }

  if (data.tutorId === data.studentId) {
    return 'Tutor and student cannot be the same person';
  }

  return null;
};

/**
 * Create a new booking for a student with a tutor
 * Validates that:
 * - Tutor exists
 * - Student exists
 * - Availability slot exists and belongs to the tutor
 * - Slot is not already booked
 * - Slot time is in the future
 */
export const createBooking = async (
  data: CreateBookingRequest
): Promise<ServiceResponse<Booking>> => {
  try {
    // Validate input
    const validationError = validateBookingRequest(data);
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    // Check if tutor exists
    const tutorExists = await prisma.tutorProfile.findUnique({
      where: { userId: data.tutorId },
      include: { user: true },
    });

    if (!tutorExists) {
      return {
        success: false,
        error: 'Tutor not found',
      };
    }

    if (!tutorExists.user.status) {
      return {
        success: false,
        error: 'Tutor account is inactive',
      };
    }

    // Check if student exists
    const studentExists = await prisma.studentProfile.findUnique({
      where: { id: data.studentId },
      include: { user: true },
    });

    if (!studentExists) {
      return {
        success: false,
        error: 'Student not found',
      };
    }

    if (!studentExists.user.status) {
      return {
        success: false,
        error: 'Student account is inactive',
      };
    }

    // Check if availability slot exists and belongs to the tutor
    const availabilitySlot = await prisma.availabilitySlot.findUnique({
      where: { id: data.availableSlotId },
    });

    if (!availabilitySlot) {
      return {
        success: false,
        error: 'Availability slot not found',
      };
    }

    if (availabilitySlot.tutorId !== data.tutorId) {
      return {
        success: false,
        error: 'Availability slot does not belong to the specified tutor',
      };
    }

    // Check if slot is already booked
    if (availabilitySlot.isBooked) {
      return {
        success: false,
        error: 'This availability slot is already booked',
      };
    }

    // Check if slot time is in the future
    if (availabilitySlot.startTime <= new Date()) {
      return {
        success: false,
        error: 'Cannot book a slot that is in the past or has already started',
      };
    }

    // Check if student already has a booking for this slot
    const existingBooking = await prisma.booking.findUnique({
      where: { availableSlotId: data.availableSlotId },
    });

    if (existingBooking) {
      return {
        success: false,
        error: 'This slot has already been booked',
      };
    }

    // Create the booking and mark the slot as booked
    const booking = await prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          tutorId: data.tutorId,
          studentId: data.studentId,
          availableSlotId: data.availableSlotId,
          price: data.price,
          status: BookingStatus.PENDING,
        },
        include: {
          tutor: {
            include: { user: true },
          },
          student: {
            include: { user: true },
          },
          availableSlot: true,
        },
      });

      // Update availability slot to mark as booked
      await tx.availabilitySlot.update({
        where: { id: data.availableSlotId },
        data: { isBooked: true },
      });

      return newBooking;
    });

    return {
      success: true,
      data: booking as any,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to create booking: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Update booking status
 * Validates that booking exists and status transition is valid
 */
export const updateBookingStatus = async (
  bookingId: string,
  data: UpdateBookingStatusRequest
): Promise<ServiceResponse<Booking>> => {
  try {
    if (!bookingId || typeof bookingId !== 'string') {
      return {
        success: false,
        error: 'Valid booking ID is required',
      };
    }

    if (!data.status || !Object.values(BookingStatus).includes(data.status)) {
      return {
        success: false,
        error: `Valid status is required. Allowed values: ${Object.values(BookingStatus).join(', ')}`,
      };
    }

    // Get the existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        availableSlot: true,
      },
    });

    if (!existingBooking) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    // Validate status transitions
    const validTransitions: { [key in BookingStatus]: BookingStatus[] } = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
      [BookingStatus.COMPLETED]: [],
      [BookingStatus.CANCELLED]: [],
    };

    if (!validTransitions[existingBooking.status].includes(data.status)) {
      return {
        success: false,
        error: `Cannot transition from ${existingBooking.status} to ${data.status}`,
      };
    }

    // If cancelling, mark slot as not booked
    if (data.status === BookingStatus.CANCELLED) {
      const updatedBooking = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.update({
          where: { id: bookingId },
          data: { status: data.status },
          include: {
            tutor: {
              include: { user: true },
            },
            student: {
              include: { user: true },
            },
            availableSlot: true,
          },
        });

        // Mark slot as not booked
        await tx.availabilitySlot.update({
          where: { id: existingBooking.availableSlotId },
          data: { isBooked: false },
        });

        return booking;
      });

      return {
        success: true,
        data: updatedBooking as any,
      };
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: data.status },
      include: {
        tutor: {
          include: { user: true },
        },
        student: {
          include: { user: true },
        },
        availableSlot: true,
      },
    });

    return {
      success: true,
      data: updatedBooking as any,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to update booking status: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Get a booking by ID
 */
export const getBookingById = async (bookingId: string): Promise<ServiceResponse<Booking>> => {
  try {
    if (!bookingId || typeof bookingId !== 'string') {
      return {
        success: false,
        error: 'Valid booking ID is required',
      };
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        tutor: {
          include: { user: true },
        },
        student: {
          include: { user: true },
        },
        availableSlot: true,
        review: true,
      },
    });

    if (!booking) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    return {
      success: true,
      data: booking as any,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch booking: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Get all bookings for a student
 * Optional filter by status
 */
export const getStudentBookings = async (
  studentId: string,
  status?: BookingStatus
): Promise<ServiceResponse<Booking[]>> => {
  try {
    if (!studentId || typeof studentId !== 'string') {
      return {
        success: false,
        error: 'Valid student ID is required',
      };
    }

    // Verify student exists
    const studentExists = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });

    if (!studentExists) {
      return {
        success: false,
        error: 'Student not found',
      };
    }

    const bookings = await prisma.booking.findMany({
      where: {
        studentId,
        ...(status ? { status } : {}),
      },
      include: {
        tutor: {
          include: { user: true },
        },
        student: {
          include: { user: true },
        },
        availableSlot: true,
        review: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: bookings as any,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch student bookings: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Get all bookings for a tutor
 * Optional filter by status
 */
export const getTutorBookings = async (
  tutorId: string,
  status?: BookingStatus
): Promise<ServiceResponse<Booking[]>> => {
  try {
    if (!tutorId || typeof tutorId !== 'string') {
      return {
        success: false,
        error: 'Valid tutor ID is required',
      };
    }

    // Verify tutor exists
    const tutorExists = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
    });

    if (!tutorExists) {
      return {
        success: false,
        error: 'Tutor not found',
      };
    }

    const bookings = await prisma.booking.findMany({
      where: {
        tutorId,
        ...(status ? { status } : {}),
      },
      include: {
        tutor: {
          include: { user: true },
        },
        student: {
          include: { user: true },
        },
        availableSlot: true,
        review: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: bookings as any,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch tutor bookings: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Cancel a booking
 * Only PENDING or CONFIRMED bookings can be cancelled
 */
export const cancelBooking = async (bookingId: string): Promise<ServiceResponse<Booking>> => {
  try {
    if (!bookingId || typeof bookingId !== 'string') {
      return {
        success: false,
        error: 'Valid booking ID is required',
      };
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        availableSlot: true,
      },
    });

    if (!existingBooking) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    if (existingBooking.status === BookingStatus.COMPLETED) {
      return {
        success: false,
        error: 'Cannot cancel a completed booking',
      };
    }

    if (existingBooking.status === BookingStatus.CANCELLED) {
      return {
        success: false,
        error: 'Booking is already cancelled',
      };
    }

    const cancelledBooking = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
        include: {
          tutor: {
            include: { user: true },
          },
          student: {
            include: { user: true },
          },
          availableSlot: true,
          review: true,
        },
      });

      // Mark slot as not booked
      await tx.availabilitySlot.update({
        where: { id: existingBooking.availableSlotId },
        data: { isBooked: false },
      });

      return booking;
    });

    return {
      success: true,
      data: cancelledBooking as any,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to cancel booking: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Get bookings within a date range
 * Useful for analytics and scheduling
 */
export const getBookingsInDateRange = async (
  startDate: Date,
  endDate: Date,
  tutorId?: string,
  status?: BookingStatus
): Promise<ServiceResponse<Booking[]>> => {
  try {
    if (endDate <= startDate) {
      return {
        success: false,
        error: 'End date must be after start date',
      };
    }

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(tutorId ? { tutorId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        tutor: {
          include: { user: true },
        },
        student: {
          include: { user: true },
        },
        availableSlot: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: bookings as any,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch bookings in date range: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};
