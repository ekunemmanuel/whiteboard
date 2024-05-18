import { drizzle } from "drizzle-orm/better-sqlite3";
import { creators, rooms, users } from "../../db/schema/classroom";
import { v4 } from "uuid";
import { initDb, pickRandomName } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const { roomCode } = await readBody<{
    roomCode: string;
  }>(event);
  const db = useDatabase();
  const drizzleDb = drizzle(db);
  await initDb();

  const userId = v4();
  const data =
    await db.sql`SELECT EXISTS(SELECT 1 FROM rooms WHERE id = ${roomCode})`;

  if (!data.rows![0]["EXISTS(SELECT 1 FROM rooms WHERE id = ?)"]) {
    throw createError({
      message: "Room not found",
    });
  }
  await drizzleDb
    .insert(users)
    .values({
      id: userId,
      name: pickRandomName(),
      roomId: roomCode,
    })
    .run();
  const { rows } = await db.sql`SELECT * FROM rooms WHERE id = ${roomCode}`;

  return {
    roomCode: rows![0].id,
    roomName: rows![0].name,
    userId: userId,
  };
});
