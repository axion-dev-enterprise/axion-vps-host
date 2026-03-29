import { createSqliteDatabase, getDatabasePath } from "../lib/sqlite";

const databasePath = getDatabasePath(process.env.DATABASE_URL ?? "file:./prisma/dev.db");
const db = createSqliteDatabase(process.env.DATABASE_URL ?? "file:./prisma/dev.db");
db.close();
process.stdout.write(`SQLite ready at ${databasePath}\n`);
