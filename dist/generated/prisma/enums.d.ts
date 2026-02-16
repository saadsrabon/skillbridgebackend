export declare const Role: {
    readonly STUDENT: "STUDENT";
    readonly TUTOR: "TUTOR";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly SUSPENDED: "SUSPENDED";
    readonly BANNED: "BANNED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const BookingStatus: {
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
//# sourceMappingURL=enums.d.ts.map