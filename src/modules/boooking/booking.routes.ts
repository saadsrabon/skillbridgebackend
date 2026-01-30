import express from 'express';
import {
  createBookingController,
  updateBookingStatusController,
  getBookingByIdController,
  getStudentBookingsController,
  getTutorBookingsController,
  cancelBookingController,
  getBookingsInDateRangeController,
} from './booking.controller';
import authChecker, { UserRole } from '../../middlewares/authChecker';

const router = express.Router();

router.post('/',authChecker(UserRole.STUDENT, UserRole.ADMIN), createBookingController);

router.get('/:bookingId',authChecker(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), getBookingByIdController);


router.patch('/:bookingId/status',authChecker(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), updateBookingStatusController);


router.delete('/:bookingId/cancel', authChecker(UserRole.STUDENT, UserRole.ADMIN), cancelBookingController);

router.get('/student/:studentId', getStudentBookingsController);

router.get('/tutor/:tutorId', getTutorBookingsController);


router.get('/range', getBookingsInDateRangeController);

export const bookingRoutes = router;
