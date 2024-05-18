import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
const engine = new Engine();
const io = new Server();

io.bind(engine);

io.on("connection", (socket) => {
  // ...
  console.log(socket.id);
  socket.on("message", (data) => {
    console.log(data);
  });
});
// export default defineEventHandler({
//   async handler(event) {
//     engine.handleRequest(event.node.req, event.node.res);
//     event._handled = true;
//   },
//   websocket: {
//     open(peer) {
//       const nodeContext = peer.ctx.node;
//       const req = nodeContext.req;

//       // @ts-expect-error private method
//       engine.prepare(req);

//       const rawSocket = nodeContext.req.socket;
//       const websocket = nodeContext.ws;

//       // @ts-expect-error private method
//       engine.onWebSocket(req, rawSocket, websocket);

//       console.log(peer.url);

//     },
//   },
// });

export default defineEventHandler((event) => initSocket(event));
