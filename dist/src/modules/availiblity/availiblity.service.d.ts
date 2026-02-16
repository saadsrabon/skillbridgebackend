import { AvailabilitySlot } from "../../../generated/prisma/client";
interface CreateSlotRequest {
    tutorId: string;
    startTime: Date;
    endTime: Date;
}
interface UpdateSlotRequest {
    startTime?: Date;
    endTime?: Date;
}
/**
 * Create a new availability slot for a tutor
 * Validates that no conflicting slots exist at the same time
 */
export declare const createAvailabilitySlot: (data: CreateSlotRequest) => Promise<{
    success: boolean;
    data?: AvailabilitySlot;
    error?: string;
}>;
/**
 * Update an existing availability slot
 * Validates that no conflicting slots exist after update
 */
export declare const updateAvailabilitySlot: (slotId: string, data: UpdateSlotRequest) => Promise<{
    success: boolean;
    data?: AvailabilitySlot;
    error?: string;
}>;
/**
 * Get all availability slots for a specific tutor
 * Returns slots sorted by start time
 */
export declare const getTutorAvailabilitySlots: (tutorId: string, includeBooked?: boolean) => Promise<{
    success: boolean;
    data?: AvailabilitySlot[];
    error?: string;
}>;
/**
 * Get a single availability slot by ID
 */
export declare const getAvailabilitySlotById: (slotId: string) => Promise<{
    success: boolean;
    data?: AvailabilitySlot;
    error?: string;
}>;
/**
 * Delete an availability slot
 * Can only delete if not booked
 */
export declare const deleteAvailabilitySlot: (slotId: string) => Promise<{
    success: boolean;
    data?: AvailabilitySlot;
    error?: string;
}>;
/**
 * Get available slots for a tutor within a date range
 * Only returns unbooked slots
 */
export declare const getAvailableSlotsInRange: (tutorId: string, startDate: Date, endDate: Date) => Promise<{
    success: boolean;
    data?: AvailabilitySlot[];
    error?: string;
}>;
export {};
//# sourceMappingURL=availiblity.service.d.ts.map