import { getQuery } from "ufo";
import { deleteUser } from "../../utils/db";

export default defineWebSocketHandler({
  async open(peer) {
    console.log(`[ws] open ${peer}`);
    const query = getQuery(peer.url);
    const roomCode = query.roomCode as string;
    const userId = query.userId as string;

    const { users } = await getUsers(roomCode);

    peer.send({
      user: "Admin",
      message: `Welcome to the room ${roomCode}`,
    });

    peer.subscribe(roomCode);
    peer.publish(roomCode, {
      user: "Admin",
      message: `${userId} joined the room`,
      users: users,
    });
  },

  async message(peer, message) {
    const query = getQuery(peer.url);
    const roomCode = query.roomCode as string;
    console.log(`[ws] message ${peer} ${message}`);
    const data = JSON.parse(message.text()) as {
      userId: string;
      message: string;
    };

    if (message.text() === "ping") {
      peer.send({ user: "Admin", message: "pong" });
      return;
    }

    const _message = {
      user: data.userId,
      message: data.message,
      // users,
    };
    peer.send(_message);
    peer.publish(roomCode, _message);
  },

  async close(peer, details) {
    console.log(details, peer);
    const query = getQuery(peer.url);
    const roomCode = query.roomCode as string;
    const userId = query.userId as string;

    const { users } = await getUsers(roomCode);
    peer.subscribe(roomCode);
    peer.publish(roomCode, {
      user: "Admin",
      message: `${userId} Left! the room`,
      users,
    });
    await deleteUser(roomCode, userId); // Remove the user from the room
  },

  error(peer, error) {
    console.log(`[ws] error ${peer}`, error);
  },

  upgrade(req) {
    return {
      headers: {
        "x-powered-by": "cross-ws",
      },
    };
  },
});
