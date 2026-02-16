import { createAvailabilitySlot, updateAvailabilitySlot, getTutorAvailabilitySlots, getAvailabilitySlotById, deleteAvailabilitySlot, getAvailableSlotsInRange, } from './availiblity.service';
/**
 * Create a new availability slot
 * POST /api/availability/slots
 */
export const createSlot = async (req, res) => {
    try {
        const { tutorId, startTime, endTime } = req.body;
        // Validate required fields
        if (!tutorId || !startTime || !endTime) {
            res.status(400).json({
                success: false,
                error: 'Missing required fields: tutorId, startTime, endTime',
            });
            return;
        }
        // Convert strings to Date objects if necessary
        const start = new Date(startTime);
        const end = new Date(endTime);
        // Validate date format
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            res.status(400).json({
                success: false,
                error: 'Invalid date format for startTime or endTime',
            });
            return;
        }
        const result = await createAvailabilitySlot({
            tutorId,
            startTime: start,
            endTime: end,
        });
        if (result.success) {
            res.status(201).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
};
/**
 * Update an availability slot
 * PATCH /api/availability/slots/:slotId
 */
export const editSlot = async (req, res) => {
    try {
        const { slotId } = req.params;
        const { startTime, endTime } = req.body;
        if (!slotId) {
            res.status(400).json({
                success: false,
                error: 'Slot ID is required',
            });
            return;
        }
        // Prepare update data
        const updateData = {};
        if (startTime) {
            const start = new Date(startTime);
            if (isNaN(start.getTime())) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid date format for startTime',
                });
                return;
            }
            updateData.startTime = start;
        }
        if (endTime) {
            const end = new Date(endTime);
            if (isNaN(end.getTime())) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid date format for endTime',
                });
                return;
            }
            updateData.endTime = end;
        }
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({
                success: false,
                error: 'At least one field (startTime or endTime) is required',
            });
            return;
        }
        const result = await updateAvailabilitySlot(Array.isArray(slotId) ? slotId[0] : slotId, updateData);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
};
/**
 * Get all availability slots for a tutor
 * GET /api/availability/tutors/:tutorId/slots
 */
export const getTutorSlots = async (req, res) => {
    try {
        const { tutorId } = req.params;
        const { includeBooked } = req.query;
        if (!tutorId) {
            res.status(400).json({
                success: false,
                error: 'Tutor ID is required',
            });
            return;
        }
        const include = includeBooked !== 'false';
        const result = await getTutorAvailabilitySlots(tutorId, include);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(404).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
};
/**
 * Get a single availability slot by ID
 * GET /api/availability/slots/:slotId
 */
export const getSlotById = async (req, res) => {
    try {
        const { slotId } = req.params;
        if (!slotId) {
            res.status(400).json({
                success: false,
                error: 'Slot ID is required',
            });
            return;
        }
        const result = await getAvailabilitySlotById(slotId);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(404).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
};
/**
 * Delete an availability slot
 * DELETE /api/availability/slots/:slotId
 */
export const deleteSlot = async (req, res) => {
    try {
        const { slotId } = req.params;
        if (!slotId) {
            res.status(400).json({
                success: false,
                error: 'Slot ID is required',
            });
            return;
        }
        const result = await deleteAvailabilitySlot(slotId);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
};
/**
 * Get available slots for a tutor within a date range
 * GET /api/availability/tutors/:tutorId/available?startDate=ISO&endDate=ISO
 */
export const getAvailableSlots = async (req, res) => {
    try {
        const { tutorId } = req.params;
        const { startDate, endDate } = req.query;
        if (!tutorId) {
            res.status(400).json({
                success: false,
                error: 'Tutor ID is required',
            });
            return;
        }
        if (!startDate || !endDate) {
            res.status(400).json({
                success: false,
                error: 'startDate and endDate query parameters are required',
            });
            return;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            res.status(400).json({
                success: false,
                error: 'Invalid date format for startDate or endDate',
            });
            return;
        }
        if (end <= start) {
            res.status(400).json({
                success: false,
                error: 'endDate must be after startDate',
            });
            return;
        }
        const result = await getAvailableSlotsInRange(tutorId, start, end);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(404).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
};
//# sourceMappingURL=avialiblity.controller.js.map