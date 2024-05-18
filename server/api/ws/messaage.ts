import { drizzle } from "drizzle-orm/better-sqlite3";
import { getQuery } from "ufo";
import { v4 } from "uuid";
import { questions } from "~/server/db/schema/classroom";

export default defineWebSocketHandler({
  async open(peer) {
    const query = getQuery(peer.url);
    const roomCode = query.roomCode as string;

    peer.subscribe(roomCode);
  },

  async message(peer, message) {
    const query = getQuery(peer.url);
    const roomCode = query.roomCode as string;
    const userId = query.userId as string;
    console.log(userId, message.text());

    // Find the user in the database for the room
    // add the message to the database of the user in the room

    const db = useDatabase();
    const drizzleDb = drizzle(db);

    await drizzleDb
      .insert(questions)
      .values({
        id: v4(),
        userId,
        question: message.text(),
        roomId: roomCode,
      })
      .run();

    peer.send(message.text());
    peer.publish(roomCode, message.text());
  },

  async close(peer, details) {
    const query = getQuery(peer.url);
    const roomCode = query.roomCode as string;
    console.log(`${roomCode} is over`);
  },

  error(peer, error) {
    console.log(`[ws] error ${peer}`, error);
  },
});
