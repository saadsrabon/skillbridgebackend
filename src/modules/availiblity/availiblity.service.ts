import { AvailabilitySlot } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


// Type for create slot request
interface CreateSlotRequest {
  tutorId: string;
  startTime: Date;
  endTime: Date;
}

// Type for update slot request
interface UpdateSlotRequest {
  startTime?: Date;
  endTime?: Date;
}

/**
 * Check if there's a conflict with existing slots for the tutor
 * Verifies that no multiple slots exist at the same time
 */
const checkSlotConflict = async (
  tutorId: string,
  startTime: Date,
  endTime: Date,
  excludeSlotId?: string
): Promise<boolean> => {
  const where: any = {
    tutorId,
    OR: [
      {
        // Existing slot starts before new slot ends and starts after new slot starts
        startTime: {
          lt: endTime,
        },
        endTime: {
          gt: startTime,
        },
      },
    ],
  };

  if (excludeSlotId) {
    where.id = { not: excludeSlotId };
  }

  const conflictingSlots = await prisma.availabilitySlot.findMany({
    where,
  });

  return conflictingSlots.length > 0;
};

/**
 * Create a new availability slot for a tutor
 * Validates that no conflicting slots exist at the same time
 */
export const createAvailabilitySlot = async (
  data: CreateSlotRequest
): Promise<{ success: boolean; data?: AvailabilitySlot; error?: string }> => {
  try {
    // Validate that endTime is after startTime
    if (data.endTime <= data.startTime) {
      return {
        success: false,
        error: 'End time must be after start time',
      };
    }

    // Check for conflicting slots
    const hasConflict = await checkSlotConflict(data.tutorId, data.startTime, data.endTime);

    if (hasConflict) {
      return {
        success: false,
        error: 'Cannot create slot: A slot already exists at this time for the tutor',
      };
    }

    // Verify tutor exists
    const tutorExists = await prisma.tutorProfile.findUnique({
      where: { userId: data.tutorId },
    });

    if (!tutorExists) {
      return {
        success: false,
        error: 'Tutor not found',
      };
    }

    const slot = await prisma.availabilitySlot.create({
      data: {
        tutorId: data.tutorId,
        startTime: data.startTime,
        endTime: data.endTime,
        isBooked: false,
      },
    });

    return {
      success: true,
      data: slot,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to create availability slot: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Update an existing availability slot
 * Validates that no conflicting slots exist after update
 */
export const updateAvailabilitySlot = async (
  slotId: string,
  data: UpdateSlotRequest
): Promise<{ success: boolean; data?: AvailabilitySlot; error?: string }> => {
  try {
    // Get the existing slot
    const existingSlot = await prisma.availabilitySlot.findUnique({
      where: { id: slotId },
    });

    if (!existingSlot) {
      return {
        success: false,
        error: 'Availability slot not found',
      };
    }

    // Cannot update if slot is already booked
    if (existingSlot.isBooked) {
      return {
        success: false,
        error: 'Cannot update a booked slot',
      };
    }

    const startTime = data.startTime || existingSlot.startTime;
    const endTime = data.endTime || existingSlot.endTime;

    // Validate that endTime is after startTime
    if (endTime <= startTime) {
      return {
        success: false,
        error: 'End time must be after start time',
      };
    }

    // Check for conflicting slots (excluding current slot)
    const hasConflict = await checkSlotConflict(existingSlot.tutorId, startTime, endTime, slotId);

    if (hasConflict) {
      return {
        success: false,
        error: 'Cannot update slot: A slot already exists at this time for the tutor',
      };
    }

    const updatedSlot = await prisma.availabilitySlot.update({
      where: { id: slotId },
      data: {
        startTime,
        endTime,
      },
    });

    return {
      success: true,
      data: updatedSlot,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to update availability slot: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Get all availability slots for a specific tutor
 * Returns slots sorted by start time
 */
export const getTutorAvailabilitySlots = async (
  tutorId: string,
  includeBooked: boolean = true
): Promise<{ success: boolean; data?: AvailabilitySlot[]; error?: string }> => {
  try {
    // Verify tutor exists
    const tutorExists = await prisma.tutorProfile.findUnique({
      where: { userId: tutorId },
    });

    if (!tutorExists) {
      return {
        success: false,
        error: 'Tutor not found',
      };
    }

    const slots = await prisma.availabilitySlot.findMany({
      where: {
        tutorId,
        ...(includeBooked ? {} : { isBooked: false }),
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return {
      success: true,
      data: slots,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch tutor availability slots: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Get a single availability slot by ID
 */
export const getAvailabilitySlotById = async (
  slotId: string
): Promise<{ success: boolean; data?: AvailabilitySlot; error?: string }> => {
  try {
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return {
        success: false,
        error: 'Availability slot not found',
      };
    }

    return {
      success: true,
      data: slot,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch availability slot: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Delete an availability slot
 * Can only delete if not booked
 */
export const deleteAvailabilitySlot = async (
  slotId: string
): Promise<{ success: boolean; data?: AvailabilitySlot; error?: string }> => {
  try {
    // Get the existing slot
    const existingSlot = await prisma.availabilitySlot.findUnique({
      where: { id: slotId },
    });

    if (!existingSlot) {
      return {
        success: false,
        error: 'Availability slot not found',
      };
    }

    // Cannot delete if slot is booked
    if (existingSlot.isBooked) {
      return {
        success: false,
        error: 'Cannot delete a booked slot',
      };
    }

    const deletedSlot = await prisma.availabilitySlot.delete({
      where: { id: slotId },
    });

    return {
      success: true,
      data: deletedSlot,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to delete availability slot: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Get available slots for a tutor within a date range
 * Only returns unbooked slots
 */
export const getAvailableSlotsInRange = async (
  tutorId: string,
  startDate: Date,
  endDate: Date
): Promise<{ success: boolean; data?: AvailabilitySlot[]; error?: string }> => {
  try {
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

    const slots = await prisma.availabilitySlot.findMany({
      where: {
        tutorId,
        isBooked: false,
        startTime: {
          gte: startDate,
        },
        endTime: {
          lte: endDate,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return {
      success: true,
      data: slots,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch available slots: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};
