process.env.DATABASE_URL ||= "file:./prisma/dev.db";

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
