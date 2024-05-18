import { getQuery } from "ufo";
import { deleteUser, getUsers } from "../../utils/db";

export default defineWebSocketHandler({
  async open(peer) {
    const query = getQuery(peer.url);
    const roomCode = query.roomCode as string;
    const userId = query.userId as string;

    // User joins the room
    const { users } = await getUsers(roomCode);
    peer.subscribe(roomCode);
    peer.publish(roomCode, {
      user: "Admin",
      message: `${userId} joined the room`,
      users: users,
    });
  },

  async close(peer, details) {
    const query = getQuery(peer.url);
    const roomCode = query.roomCode as string;
    const userId = query.userId as string;

    // User leaves the room
    await deleteUser(roomCode, userId);
    const { users } = await getUsers(roomCode);
    peer.publish(roomCode, {
      user: "Admin",
      message: `${userId} left the room`,
      users: users,
    });
  },

  error(peer, error) {
    console.log(`[ws] error ${peer}`, error);
  },
});