# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

        selected
                ? 'bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 ring-1 ring-inset'
                : '',

                  //   ctx.value?.clearRect(

// x - tools.value.width / 2,
// y - tools.value.width / 2,
// tools.value.width,
// tools.value.width
// );
/_
room: {
id: string;
name: string;
createdAt: string;
updatedAt: string;
creator: {
id: string;
name: string;
},
users: [
{
id: string;
name: string;
}
],
questions: [
{
userId: string;
question: string;
}
],
canvas: {
creatorId:string;
data:blob|string
}
}
_/


import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import type { Server } from "socket.io";
import { v4 } from "uuid";
import { creators, rooms } from "../server/db/schema/classroom";
import { createDatabase } from "db0";
import sqlite from "db0/connectors/better-sqlite3";
import { initDb,pickRandomName } from "../server/utils/db";
export default function (io: Server) {
  io.on("connection", async (socket) => {
    console.log("A user connected");

    try {
      const creatorId = v4();
      const roomId = v4();
      const roomName = "Room-" + roomId;
      const db = createDatabase(sqlite({}));
      const drizzleDb = drizzle(db);
      await initDb();

      await createCreator(drizzleDb, creatorId);
      await createRoom(drizzleDb, roomId, creatorId, roomName);

      console.log(
        `Room ${roomName} created with ID ${roomId} by creator ${creatorId}`
      );

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });

      socket.on("message", (msg: any) => {
        console.log("Received message: " + msg);
      });

    
    } catch (error) {
      console.error("Error occurred: ", error);
      throw new Error("Something went wrong");
    }
  });
}

async function createCreator(
  drizzleDb: BetterSQLite3Database,
  creatorId: string
) {
  await drizzleDb
    .insert(creators)
    .values({
      id: creatorId,
      name: "Creator-" + pickRandomName(),
    })
    .run();
}

async function createRoom(
  drizzleDb: BetterSQLite3Database,
  roomId: string,
  creatorId: string,
  roomName: string
) {
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
}
import { defineNuxtModule } from "@nuxt/kit";
import { Server } from "socket.io";

export interface ModuleDefinitions {
  socketFunction: (io: any) => void;
}
export default defineNuxtModule({
  meta: {
    name: "nuxt-internal-socket",
    configKey: "socketIo",
  },
  defaults: {
    socketFunction: null as null | ((io: Server) => void),
  },
  async setup(option, nuxt) {
    console.log("Successful 🎉");
    if (!option.socketFunction) {
      await nuxt.close();
      throw new Error("Pls provide socket function");
    }
    nuxt.hook("listen", (server) => {
      if (option.socketFunction) {
        const io = new Server(server);
        option.socketFunction(io);
      }
    });
  },
});
