import "dotenv/config";
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
async function check() {
    console.log("Checking DB connection...");
    const connectionString = `${process.env.DATABASE_URL}`;
    console.log("Connection string (masked):", connectionString.replace(/:([^@]+)@/, ":****@"));
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });
    try {
        const userCount = await prisma.user.count();
        console.log("User count:", userCount);
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@skillbridge.com' }
        });
        console.log("Admin user found:", !!admin);
        if (admin) {
            const account = await prisma.account.findFirst({
                where: { userId: admin.id }
            });
            console.log("Admin account found:", !!account);
            if (account) {
                console.log("Admin password (first 5 chars):", account.password?.substring(0, 5));
                console.log("Is password hashed (starts with $):", account.password?.startsWith('$'));
            }
        }
    }
    catch (error) {
        console.error("DB Check failed:", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
check();
//# sourceMappingURL=check-db.js.map