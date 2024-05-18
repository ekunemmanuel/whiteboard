import { getQuery } from "ufo";

export default defineWebSocketHandler({
  async open(peer) {
    const query = getQuery(peer.url);
    const roomCode = query.roomCode as string;

    peer.subscribe(roomCode);
    // peer.publish(roomCode, {
    //   user: "Admin",
    //   message: `you can use the board`,
    // });
  },

  async message(peer, message) {
    const query = getQuery(peer.url);
    const roomCode = query.roomCode as string;
    const userId = query.userId as string;
    console.log(userId);

    peer.subscribe(roomCode);
    peer.publish(roomCode, {
      board: JSON.parse(message.text()),
    });
  },

  async close(peer, details) {
    const query = getQuery(peer.url);
    const roomCode = query.roomCode as string;
    const userId = query.userId as string;
    console.log(`${userId} has closed the board`);
    
    peer.publish(roomCode, {
      user: "Admin",
      message: `${userId} has closed the board`,
    });
  },

  error(peer, error) {
    console.log(`[ws] error ${peer}`, error);
  },
});
