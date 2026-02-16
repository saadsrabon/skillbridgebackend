import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/authChecker";
async function seedAdmin() {
    try {
        console.log("***** Admin Seeding Started....");
        const adminData = {
            name: "Admin2 Saheb",
            email: "admin2@admin.com",
            role: UserRole.ADMIN,
            password: "admin1234"
        };
        console.log("***** Checking Admin Exist or not");
        // check user exist on db or not
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });
        if (existingUser) {
            throw new Error("User already exists!!");
        }
        const data = await auth.api.signUpEmail({
            body: {
                name: "Saad",
                email: "admin@saad.com",
                password: "password1234",
            },
        });
    }
    catch (error) {
        console.error(error);
    }
}
seedAdmin();
//# sourceMappingURL=seedadmin.js.map