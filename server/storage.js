"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.DatabaseStorage = void 0;
const schema_1 = require("../shared/schema");
const db_1 = require("./db");
const drizzle_orm_1 = require("drizzle-orm");
class DatabaseStorage {
    // User operations
    async getUser(id) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        return user;
    }
    async getUserByEmail(email) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        return user;
    }
    async getUserByPhone(phone) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.phone, phone));
        return user;
    }
    async getUserByGoogleId(googleId) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.googleId, googleId));
        return user;
    }
    async createUser(userData) {
        const [user] = await db_1.db
            .insert(schema_1.users)
            .values(userData)
            .returning();
        return user;
    }
    async updateUser(id, updates) {
        const [user] = await db_1.db
            .update(schema_1.users)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
            .returning();
        return user;
    }
    async upsertUser(userData) {
        const [user] = await db_1.db
            .insert(schema_1.users)
            .values(userData)
            .onConflictDoUpdate({
            target: schema_1.users.id,
            set: {
                ...userData,
                updatedAt: new Date(),
            },
        })
            .returning();
        return user;
    }
    // Verification codes
    async createVerificationCode(codeData) {
        const [code] = await db_1.db
            .insert(schema_1.verificationCodes)
            .values(codeData)
            .returning();
        return code;
    }
    async getVerificationCode(userId, type) {
        const [code] = await db_1.db
            .select()
            .from(schema_1.verificationCodes)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.verificationCodes.userId, userId), (0, drizzle_orm_1.eq)(schema_1.verificationCodes.type, type), (0, drizzle_orm_1.eq)(schema_1.verificationCodes.isUsed, false)))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.verificationCodes.createdAt))
            .limit(1);
        return code;
    }
    async markCodeAsUsed(id) {
        await db_1.db
            .update(schema_1.verificationCodes)
            .set({ isUsed: true })
            .where((0, drizzle_orm_1.eq)(schema_1.verificationCodes.id, id));
    }
    // Chat operations
    async createChatSession(sessionData) {
        const [session] = await db_1.db
            .insert(schema_1.chatSessions)
            .values(sessionData)
            .returning();
        return session;
    }
    async getChatSession(id) {
        const [session] = await db_1.db
            .select()
            .from(schema_1.chatSessions)
            .where((0, drizzle_orm_1.eq)(schema_1.chatSessions.id, id));
        return session;
    }
    async getUserChatSessions(userId) {
        return await db_1.db
            .select()
            .from(schema_1.chatSessions)
            .where((0, drizzle_orm_1.eq)(schema_1.chatSessions.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.chatSessions.updatedAt));
    }
    async deleteChatSession(id) {
        await db_1.db.delete(schema_1.chatSessions).where((0, drizzle_orm_1.eq)(schema_1.chatSessions.id, id));
    }
    async addChatMessage(messageData) {
        const [message] = await db_1.db
            .insert(schema_1.chatMessages)
            .values(messageData)
            .returning();
        // Update session timestamp
        await db_1.db
            .update(schema_1.chatSessions)
            .set({ updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.chatSessions.id, messageData.sessionId));
        return message;
    }
    async getChatMessages(sessionId) {
        return await db_1.db
            .select()
            .from(schema_1.chatMessages)
            .where((0, drizzle_orm_1.eq)(schema_1.chatMessages.sessionId, sessionId))
            .orderBy(schema_1.chatMessages.createdAt);
    }
    // Legal documents operations
    async createLegalDocument(documentData) {
        const [document] = await db_1.db
            .insert(schema_1.legalDocuments)
            .values(documentData)
            .returning();
        return document;
    }
    async getLegalDocuments(limit = 50, offset = 0) {
        return await db_1.db
            .select()
            .from(schema_1.legalDocuments)
            .where((0, drizzle_orm_1.eq)(schema_1.legalDocuments.isActive, true))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.legalDocuments.createdAt))
            .limit(limit)
            .offset(offset);
    }
    async searchLegalDocuments(query) {
        return await db_1.db
            .select()
            .from(schema_1.legalDocuments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.legalDocuments.isActive, true), (0, drizzle_orm_1.ilike)(schema_1.legalDocuments.content, `%${query}%`)))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.legalDocuments.createdAt));
    }
    async getLegalDocument(id) {
        const [document] = await db_1.db
            .select()
            .from(schema_1.legalDocuments)
            .where((0, drizzle_orm_1.eq)(schema_1.legalDocuments.id, id));
        return document;
    }
    async updateLegalDocument(id, updates) {
        const [document] = await db_1.db
            .update(schema_1.legalDocuments)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.legalDocuments.id, id))
            .returning();
        return document;
    }
    async deleteLegalDocument(id) {
        await db_1.db
            .update(schema_1.legalDocuments)
            .set({ isActive: false, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.legalDocuments.id, id));
    }
    // User preferences
    async getUserPreferences(userId) {
        const [preferences] = await db_1.db
            .select()
            .from(schema_1.userPreferences)
            .where((0, drizzle_orm_1.eq)(schema_1.userPreferences.userId, userId));
        return preferences;
    }
    async upsertUserPreferences(preferencesData) {
        const [preferences] = await db_1.db
            .insert(schema_1.userPreferences)
            .values(preferencesData)
            .onConflictDoUpdate({
            target: schema_1.userPreferences.userId,
            set: {
                ...preferencesData,
                updatedAt: new Date(),
            },
        })
            .returning();
        return preferences;
    }
    // Research history
    async addResearchHistory(historyData) {
        const [history] = await db_1.db
            .insert(schema_1.researchHistory)
            .values(historyData)
            .returning();
        return history;
    }
    async getUserResearchHistory(userId, limit = 20) {
        return await db_1.db
            .select()
            .from(schema_1.researchHistory)
            .where((0, drizzle_orm_1.eq)(schema_1.researchHistory.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.researchHistory.createdAt))
            .limit(limit);
    }
}
exports.DatabaseStorage = DatabaseStorage;
exports.storage = new DatabaseStorage();
