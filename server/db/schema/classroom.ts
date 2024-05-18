import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

// Define tables
export const creators = sqliteTable("creators", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
});

export const rooms = sqliteTable("rooms", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  createdAt: text("createdAt"),
  updatedAt: text("updatedAt"),
  creatorId: text("creatorId").references(() => creators.id),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  roomId: text("roomId").references(() => rooms.id),
});

export const questions = sqliteTable("questions", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => users.id),
  question: text("question"),
  roomId: text("roomId").references(() => rooms.id),
});

export const canvas = sqliteTable("canvas", {
  data: text("data"),
  roomId: text("roomId").references(() => rooms.id),
});
