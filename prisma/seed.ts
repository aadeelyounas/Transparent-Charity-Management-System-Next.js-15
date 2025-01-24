import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const hashedPassword = await bcrypt.hash("Admin@1234", 12);

  // Create database user
  const admin = await prisma.user.upsert({
    where: { email: "admin@seri-ghanial.org" },
    update: {},
    create: {
      email: "admin@seri-ghanial.org",
      name: "Admin User",
      role: "admin",
      password: hashedPassword,
    },
  });

  console.log("Created initial admin user:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });