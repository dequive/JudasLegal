"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.researchHistoryRelations = exports.userPreferencesRelations = exports.documentEmbeddingsRelations = exports.legalDocumentsRelations = exports.chatMessagesRelations = exports.chatSessionsRelations = exports.verificationCodesRelations = exports.usersRelations = exports.researchHistory = exports.userPreferences = exports.documentEmbeddings = exports.legalDocuments = exports.chatMessages = exports.chatSessions = exports.verificationCodes = exports.users = exports.sessions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Session storage table - mandatory for Replit Auth
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    sid: (0, pg_core_1.varchar)("sid").primaryKey(),
    sess: (0, pg_core_1.jsonb)("sess").notNull(),
    expire: (0, pg_core_1.timestamp)("expire").notNull(),
}, (table) => [(0, pg_core_1.index)("IDX_session_expire").on(table.expire)]);
// User storage table with comprehensive authentication
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().notNull(),
    email: (0, pg_core_1.varchar)("email").unique(),
    phone: (0, pg_core_1.varchar)("phone").unique(),
    firstName: (0, pg_core_1.varchar)("first_name"),
    lastName: (0, pg_core_1.varchar)("last_name"),
    profileImageUrl: (0, pg_core_1.varchar)("profile_image_url"),
    password: (0, pg_core_1.varchar)("password"), // hashed password for email/phone auth
    isEmailVerified: (0, pg_core_1.boolean)("is_email_verified").default(false),
    isPhoneVerified: (0, pg_core_1.boolean)("is_phone_verified").default(false),
    authProvider: (0, pg_core_1.varchar)("auth_provider").default("email"), // 'email', 'phone', 'google'
    googleId: (0, pg_core_1.varchar)("google_id"),
    lastLoginAt: (0, pg_core_1.timestamp)("last_login_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Verification codes for email/phone verification
exports.verificationCodes = (0, pg_core_1.pgTable)("verification_codes", {
    id: (0, pg_core_1.varchar)("id").primaryKey().notNull(),
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id, { onDelete: "cascade" }),
    code: (0, pg_core_1.varchar)("code").notNull(),
    type: (0, pg_core_1.varchar)("type").notNull(), // 'email', 'phone', 'reset'
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    isUsed: (0, pg_core_1.boolean)("is_used").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Chat sessions for conversation management
exports.chatSessions = (0, pg_core_1.pgTable)("chat_sessions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().notNull(),
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id, { onDelete: "cascade" }),
    title: (0, pg_core_1.varchar)("title").notNull().default("Nova Conversa"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Chat messages for conversation history
exports.chatMessages = (0, pg_core_1.pgTable)("chat_messages", {
    id: (0, pg_core_1.varchar)("id").primaryKey().notNull(),
    sessionId: (0, pg_core_1.varchar)("session_id").references(() => exports.chatSessions.id, { onDelete: "cascade" }),
    role: (0, pg_core_1.varchar)("role").notNull(), // 'user' or 'assistant'
    content: (0, pg_core_1.text)("content").notNull(),
    complexity: (0, pg_core_1.jsonb)("complexity"), // complexity analysis data
    citations: (0, pg_core_1.jsonb)("citations"), // legal citations array
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Legal documents for the knowledge base
exports.legalDocuments = (0, pg_core_1.pgTable)("legal_documents", {
    id: (0, pg_core_1.varchar)("id").primaryKey().notNull(),
    title: (0, pg_core_1.varchar)("title").notNull(),
    type: (0, pg_core_1.varchar)("type").notNull(), // 'constitution', 'code', 'law', 'decree'
    source: (0, pg_core_1.varchar)("source").notNull(),
    description: (0, pg_core_1.text)("description"),
    content: (0, pg_core_1.text)("content").notNull(),
    uploadedBy: (0, pg_core_1.varchar)("uploaded_by").references(() => exports.users.id),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Document embeddings for RAG system
exports.documentEmbeddings = (0, pg_core_1.pgTable)("document_embeddings", {
    id: (0, pg_core_1.varchar)("id").primaryKey().notNull(),
    documentId: (0, pg_core_1.varchar)("document_id").references(() => exports.legalDocuments.id, { onDelete: "cascade" }),
    chunkIndex: (0, pg_core_1.integer)("chunk_index").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    embedding: (0, pg_core_1.jsonb)("embedding"), // Vector embedding as JSON array
    metadata: (0, pg_core_1.jsonb)("metadata"), // Additional chunk metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// User preferences and settings
exports.userPreferences = (0, pg_core_1.pgTable)("user_preferences", {
    id: (0, pg_core_1.varchar)("id").primaryKey().notNull(),
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id, { onDelete: "cascade" }),
    language: (0, pg_core_1.varchar)("language").default("pt"),
    theme: (0, pg_core_1.varchar)("theme").default("light"),
    notifications: (0, pg_core_1.boolean)("notifications").default(true),
    complexityLevel: (0, pg_core_1.varchar)("complexity_level").default("moderate"), // 'simple', 'moderate', 'complex'
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// User research history
exports.researchHistory = (0, pg_core_1.pgTable)("research_history", {
    id: (0, pg_core_1.varchar)("id").primaryKey().notNull(),
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id, { onDelete: "cascade" }),
    query: (0, pg_core_1.text)("query").notNull(),
    results: (0, pg_core_1.jsonb)("results"), // Search results and documents found
    satisfaction: (0, pg_core_1.integer)("satisfaction"), // User rating 1-5
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Relations
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many, one }) => ({
    chatSessions: many(exports.chatSessions),
    legalDocuments: many(exports.legalDocuments),
    preferences: one(exports.userPreferences),
    researchHistory: many(exports.researchHistory),
    verificationCodes: many(exports.verificationCodes),
}));
exports.verificationCodesRelations = (0, drizzle_orm_1.relations)(exports.verificationCodes, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.verificationCodes.userId],
        references: [exports.users.id],
    }),
}));
exports.chatSessionsRelations = (0, drizzle_orm_1.relations)(exports.chatSessions, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.chatSessions.userId],
        references: [exports.users.id],
    }),
    messages: many(exports.chatMessages),
}));
exports.chatMessagesRelations = (0, drizzle_orm_1.relations)(exports.chatMessages, ({ one }) => ({
    session: one(exports.chatSessions, {
        fields: [exports.chatMessages.sessionId],
        references: [exports.chatSessions.id],
    }),
}));
exports.legalDocumentsRelations = (0, drizzle_orm_1.relations)(exports.legalDocuments, ({ one, many }) => ({
    uploadedByUser: one(exports.users, {
        fields: [exports.legalDocuments.uploadedBy],
        references: [exports.users.id],
    }),
    embeddings: many(exports.documentEmbeddings),
}));
exports.documentEmbeddingsRelations = (0, drizzle_orm_1.relations)(exports.documentEmbeddings, ({ one }) => ({
    document: one(exports.legalDocuments, {
        fields: [exports.documentEmbeddings.documentId],
        references: [exports.legalDocuments.id],
    }),
}));
exports.userPreferencesRelations = (0, drizzle_orm_1.relations)(exports.userPreferences, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.userPreferences.userId],
        references: [exports.users.id],
    }),
}));
exports.researchHistoryRelations = (0, drizzle_orm_1.relations)(exports.researchHistory, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.researchHistory.userId],
        references: [exports.users.id],
    }),
}));
