export async function initDb() {
  const db = useDatabase();

  await db.sql`CREATE TABLE IF NOT EXISTS creators (id text primary key, name TEXT)`;
  await db.sql`CREATE TABLE IF NOT EXISTS rooms (id text primary key, name TEXT, createdAt TEXT, updatedAt TEXT, creatorId text, FOREIGN KEY(creatorId) REFERENCES creators(id))`;
  await db.sql`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, roomId TEXT, FOREIGN KEY(roomId) REFERENCES rooms(id))`;
  await db.sql`CREATE TABLE IF NOT EXISTS questions (id TEXT PRIMARY KEY,userId TEXT, question TEXT, roomId TEXT, FOREIGN KEY(userId) REFERENCES users(id), FOREIGN KEY(roomId) REFERENCES rooms(id))`;
  await db.sql`CREATE TABLE IF NOT EXISTS canvas (id TEXT PRIMARY KEY,data TEXT, roomId TEXT, FOREIGN KEY(roomId) REFERENCES rooms(id))`;
}

export function pickRandomName() {
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "Dave",
    "Eve",
    "Frank",
    "Grace",
    "Heidi",
    "Ivan",
    "Judy",
  ];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

export async function getUsers(roomCode: string) {
  const db = useDatabase();
  const { rows } = await db.sql`SELECT users.id, users.name
  FROM users
  WHERE users.roomId = ${roomCode}`;
  if (rows === undefined) {
    return {
      users: [],
    };
  }
  return {
    users: rows,
  };
}

export async function deleteUser(roomCode: string, userId: string) {
  const db = useDatabase();
  const { rows } =
    await db.sql`DELETE FROM users WHERE id = ${userId} AND roomId = ${roomCode}`;

  return {
    users: rows,
  };
}
export async function getQuestions(roomCode: string) {
  const db = useDatabase();
  const { rows } = await db.sql`SELECT questions.userId, questions.question
  FROM questions
  WHERE questions.roomId = ${roomCode}`;

  return {
    questions: rows,
  };
}

export async function getCanvas(roomCode: string) {
  const db = useDatabase();
  const { rows } = await db.sql`SELECT canvas.data
  FROM canvas
  WHERE canvas.roomId = ${roomCode}`;

  return {
    canvas: rows,
  };
}

async function getRoom(roomCode: string) {
  const db = useDatabase();

  const { rows } = await db.sql`SELECT 
  rooms.id AS roomId, 
  rooms.name AS roomName, 
  rooms.createdAt, 
  rooms.updatedAt, 
  creators.id AS creatorId, 
  creators.name AS creatorName, 
  users.id AS userId, 
  users.name AS userName, 
  questions.userId AS questionUserId, 
  questions.question 
FROM 
  rooms 
LEFT JOIN 
  creators ON rooms.creatorId = creators.id 
LEFT JOIN 
  users ON rooms.id = users.roomId 
LEFT JOIN 
  questions ON rooms.id = questions.roomId 
WHERE 
  rooms.id = ${roomCode}`;

  // Assuming 'rows' is the result from your SQL query
  const formattedResult = {
    id: rows![0].roomId,
    name: rows![0].roomName,
    createdAt: rows![0].createdAt,
    updatedAt: rows![0].updatedAt,
    creator: {
      id: rows![0].creatorId,
      name: rows![0].creatorName,
    },
    users: rows!.map((row) => ({
      id: row.userId,
      name: row.userName,
    })),
    questions: rows!
      .filter((row) => row.questionUserId !== null)
      .map((row) => ({
        userId: row.questionUserId,
        question: row.question,
      })),
    canvas: {
      // canvas data
    },
  };

  console.log(formattedResult);
}
