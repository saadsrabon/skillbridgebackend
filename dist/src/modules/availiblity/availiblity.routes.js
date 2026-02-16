import express from 'express';
import { createSlot, editSlot, getTutorSlots, getSlotById, deleteSlot, getAvailableSlots, } from './avialiblity.controller';
const router = express.Router();
/**
 * POST /slots
 * Create a new availability slot
 */
router.post('/', createSlot);
/**
 * GET /slots/:slotId
 * Get a specific availability slot by ID
 */
router.get('/:slotId', getSlotById);
/**
 * PATCH /slots/:slotId
 * Update an availability slot
 */
router.patch('/:slotId', editSlot);
/**
 * DELETE /slots/:slotId
 * Delete an availability slot
 */
router.delete('/:slotId', deleteSlot);
/**
 * GET slots/tutors/:tutorId/slots
 * Get all availability slots for a tutor (includes booked by default)
 * Query params: includeBooked=false to exclude booked slots
 */
router.get('/tutors/:tutorId/slots', getTutorSlots);
/**
 * GET /slots/tutors/:tutorId/available
 * Get available (unbooked) slots for a tutor within a date range
 * Query params: startDate=ISO_DATE, endDate=ISO_DATE
 */
router.get('/tutors/:tutorId/available', getAvailableSlots);
export const availabilityRoutes = router;
//# sourceMappingURL=availiblity.routes.js.map