import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat sessions for conversation management
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull().default("Nova Conversa"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages for conversation history
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().notNull(),
  sessionId: varchar("session_id").references(() => chatSessions.id, { onDelete: "cascade" }),
  role: varchar("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  complexity: jsonb("complexity"), // complexity analysis data
  citations: jsonb("citations"), // legal citations array
  createdAt: timestamp("created_at").defaultNow(),
});

// Legal documents for the knowledge base
export const legalDocuments = pgTable("legal_documents", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // 'constitution', 'code', 'law', 'decree'
  source: varchar("source").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document embeddings for RAG system
export const documentEmbeddings = pgTable("document_embeddings", {
  id: varchar("id").primaryKey().notNull(),
  documentId: varchar("document_id").references(() => legalDocuments.id, { onDelete: "cascade" }),
  chunkIndex: integer("chunk_index").notNull(),
  content: text("content").notNull(),
  embedding: jsonb("embedding"), // Vector embedding as JSON array
  metadata: jsonb("metadata"), // Additional chunk metadata
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences and settings
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  language: varchar("language").default("pt"),
  theme: varchar("theme").default("light"),
  notifications: boolean("notifications").default(true),
  complexityLevel: varchar("complexity_level").default("moderate"), // 'simple', 'moderate', 'complex'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User research history
export const researchHistory = pgTable("research_history", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  query: text("query").notNull(),
  results: jsonb("results"), // Search results and documents found
  satisfaction: integer("satisfaction"), // User rating 1-5
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  chatSessions: many(chatSessions),
  legalDocuments: many(legalDocuments),
  preferences: one(userPreferences),
  researchHistory: many(researchHistory),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id],
  }),
}));

export const legalDocumentsRelations = relations(legalDocuments, ({ one, many }) => ({
  uploadedByUser: one(users, {
    fields: [legalDocuments.uploadedBy],
    references: [users.id],
  }),
  embeddings: many(documentEmbeddings),
}));

export const documentEmbeddingsRelations = relations(documentEmbeddings, ({ one }) => ({
  document: one(legalDocuments, {
    fields: [documentEmbeddings.documentId],
    references: [legalDocuments.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const researchHistoryRelations = relations(researchHistory, ({ one }) => ({
  user: one(users, {
    fields: [researchHistory.userId],
    references: [users.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
export type LegalDocument = typeof legalDocuments.$inferSelect;
export type InsertLegalDocument = typeof legalDocuments.$inferInsert;
export type DocumentEmbedding = typeof documentEmbeddings.$inferSelect;
export type InsertDocumentEmbedding = typeof documentEmbeddings.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;
export type ResearchHistory = typeof researchHistory.$inferSelect;
export type InsertResearchHistory = typeof researchHistory.$inferInsert;