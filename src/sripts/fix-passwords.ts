import "dotenv/config";
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from "bcrypt";

async function fix() {
  console.log("Fixing passwords...");
  const connectionString = `${process.env.DATABASE_URL}`;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const accounts = await prisma.account.findMany({
        where: { providerId: 'credential' }
    });
    console.log(`Found ${accounts.length} accounts to fix.`);

    for (const account of accounts) {
        if (account.password && !account.password.startsWith('$')) {
            console.log(`Hashing password for account: ${account.id}`);
            const hashedPassword = await bcrypt.hash(account.password, 10);
            await prisma.account.update({
                where: { id: account.id },
                data: { password: hashedPassword }
            });
            console.log(`Updated account: ${account.id}`);
        } else {
            console.log(`Skipping account ${account.id} (already hashed or no password)`);
        }
    }
    console.log("All passwords fixed!");
  } catch (error) {
    console.error("Fix failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fix();
