import { drizzle } from "drizzle-orm/better-sqlite3";
import { creators, rooms, users } from "../../db/schema/classroom";
import { v4 } from "uuid";
import { initDb, pickRandomName } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const { roomName } = await readBody<{
    roomName: string;
  }>(event);
    const db = useDatabase();
    const drizzleDb = drizzle(db);
    await initDb();
  try {

    const creatorId = v4();
    const roomId = v4();
    await drizzleDb
      .insert(creators)
      .values({
        id: creatorId,
        name: "Creator-" + pickRandomName(),
      })
      .run();

    await drizzleDb
      .insert(rooms)
      .values({
        id: roomId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: roomName,
        creatorId: creatorId,
      })
      .run();

    return {
      roomCode: roomId,
      creatorId,
      roomName,
    };
  } catch (error) {
    console.log(error);

    throw createError({
      message: "Something went wrong",
    });
  }
});
