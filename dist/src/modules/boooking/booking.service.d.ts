import { Booking, BookingStatus } from '../../../generated/prisma/client';
interface CreateBookingRequest {
    tutorId: string;
    studentId: string;
    availableSlotId: string;
    price: number;
}
interface UpdateBookingStatusRequest {
    status: BookingStatus;
}
interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
/**
 * Create a new booking for a student with a tutor
 * Validates that:
 * - Tutor exists
 * - Student exists
 * - Availability slot exists and belongs to the tutor
 * - Slot is not already booked
 * - Slot time is in the future
 */
export declare const createBooking: (data: CreateBookingRequest) => Promise<ServiceResponse<Booking>>;
/**
 * Update booking status
 * Validates that booking exists and status transition is valid
 */
export declare const updateBookingStatus: (bookingId: string, data: UpdateBookingStatusRequest) => Promise<ServiceResponse<Booking>>;
/**
 * Get a booking by ID
 */
export declare const getBookingById: (bookingId: string) => Promise<ServiceResponse<Booking>>;
/**
 * Get all bookings for a student
 * Optional filter by status
 */
export declare const getStudentBookings: (studentId: string, status?: BookingStatus) => Promise<ServiceResponse<Booking[]>>;
/**
 * Get all bookings for a tutor
 * Optional filter by status
 */
export declare const getTutorBookings: (tutorId: string, status?: BookingStatus) => Promise<ServiceResponse<Booking[]>>;
/**
 * Cancel a booking
 * Only PENDING or CONFIRMED bookings can be cancelled
 */
export declare const cancelBooking: (bookingId: string) => Promise<ServiceResponse<Booking>>;
/**
 * Get bookings within a date range
 * Useful for analytics and scheduling
 */
export declare const getBookingsInDateRange: (startDate: Date, endDate: Date, tutorId?: string, status?: BookingStatus) => Promise<ServiceResponse<Booking[]>>;
/**
 * Create a review for a completed booking
 * Validates that:
 * - Booking exists and is COMPLETED
 * - Student owns the booking
 * - No review exists for this booking yet
 * - Rating is between 1-5
 */
interface CreateReviewRequest {
    bookingId: string;
    studentId: string;
    rating: number;
    comment?: string;
}
export declare const createReview: (data: CreateReviewRequest) => Promise<ServiceResponse<any>>;
export {};
//# sourceMappingURL=booking.service.d.ts.map