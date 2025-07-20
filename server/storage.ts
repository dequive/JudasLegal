import {
  users,
  verificationCodes,
  chatSessions,
  chatMessages,
  legalDocuments,
  userPreferences,
  researchHistory,
  type User,
  type UpsertUser,
  type InsertUser,
  type VerificationCode,
  type InsertVerificationCode,
  type ChatSession,
  type InsertChatSession,
  type ChatMessage,
  type InsertChatMessage,
  type LegalDocument,
  type InsertLegalDocument,
  type UserPreferences,
  type InsertUserPreferences,
  type ResearchHistory,
  type InsertResearchHistory,
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, and, like, ilike } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Verification codes
  createVerificationCode(code: InsertVerificationCode): Promise<VerificationCode>;
  getVerificationCode(userId: string, type: string): Promise<VerificationCode | undefined>;
  markCodeAsUsed(id: string): Promise<void>;
  
  // Chat operations
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getUserChatSessions(userId: string): Promise<ChatSession[]>;
  deleteChatSession(id: string): Promise<void>;
  
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  
  // Legal documents operations
  createLegalDocument(document: InsertLegalDocument): Promise<LegalDocument>;
  getLegalDocuments(limit?: number, offset?: number): Promise<LegalDocument[]>;
  searchLegalDocuments(query: string): Promise<LegalDocument[]>;
  getLegalDocument(id: string): Promise<LegalDocument | undefined>;
  updateLegalDocument(id: string, updates: Partial<LegalDocument>): Promise<LegalDocument>;
  deleteLegalDocument(id: string): Promise<void>;
  
  // User preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Research history
  addResearchHistory(history: InsertResearchHistory): Promise<ResearchHistory>;
  getUserResearchHistory(userId: string, limit?: number): Promise<ResearchHistory[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Verification codes
  async createVerificationCode(codeData: InsertVerificationCode): Promise<VerificationCode> {
    const [code] = await db
      .insert(verificationCodes)
      .values(codeData)
      .returning();
    return code;
  }

  async getVerificationCode(userId: string, type: string): Promise<VerificationCode | undefined> {
    const [code] = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.userId, userId),
          eq(verificationCodes.type, type),
          eq(verificationCodes.isUsed, false)
        )
      )
      .orderBy(desc(verificationCodes.createdAt))
      .limit(1);
    return code;
  }

  async markCodeAsUsed(id: string): Promise<void> {
    await db
      .update(verificationCodes)
      .set({ isUsed: true })
      .where(eq(verificationCodes.id, id));
  }

  // Chat operations
  async createChatSession(sessionData: InsertChatSession): Promise<ChatSession> {
    const [session] = await db
      .insert(chatSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, id));
    return session;
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    return await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt));
  }

  async deleteChatSession(id: string): Promise<void> {
    await db.delete(chatSessions).where(eq(chatSessions.id, id));
  }

  async addChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(messageData)
      .returning();
    
    // Update session timestamp
    await db
      .update(chatSessions)
      .set({ updatedAt: new Date() })
      .where(eq(chatSessions.id, messageData.sessionId!));
    
    return message;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  // Legal documents operations
  async createLegalDocument(documentData: InsertLegalDocument): Promise<LegalDocument> {
    const [document] = await db
      .insert(legalDocuments)
      .values(documentData)
      .returning();
    return document;
  }

  async getLegalDocuments(limit = 50, offset = 0): Promise<LegalDocument[]> {
    return await db
      .select()
      .from(legalDocuments)
      .where(eq(legalDocuments.isActive, true))
      .orderBy(desc(legalDocuments.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async searchLegalDocuments(query: string): Promise<LegalDocument[]> {
    return await db
      .select()
      .from(legalDocuments)
      .where(
        and(
          eq(legalDocuments.isActive, true),
          ilike(legalDocuments.content, `%${query}%`)
        )
      )
      .orderBy(desc(legalDocuments.createdAt));
  }

  async getLegalDocument(id: string): Promise<LegalDocument | undefined> {
    const [document] = await db
      .select()
      .from(legalDocuments)
      .where(eq(legalDocuments.id, id));
    return document;
  }

  async updateLegalDocument(id: string, updates: Partial<LegalDocument>): Promise<LegalDocument> {
    const [document] = await db
      .update(legalDocuments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(legalDocuments.id, id))
      .returning();
    return document;
  }

  async deleteLegalDocument(id: string): Promise<void> {
    await db
      .update(legalDocuments)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(legalDocuments.id, id));
  }

  // User preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async upsertUserPreferences(preferencesData: InsertUserPreferences): Promise<UserPreferences> {
    const [preferences] = await db
      .insert(userPreferences)
      .values(preferencesData)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...preferencesData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return preferences;
  }

  // Research history
  async addResearchHistory(historyData: InsertResearchHistory): Promise<ResearchHistory> {
    const [history] = await db
      .insert(researchHistory)
      .values(historyData)
      .returning();
    return history;
  }

  async getUserResearchHistory(userId: string, limit = 20): Promise<ResearchHistory[]> {
    return await db
      .select()
      .from(researchHistory)
      .where(eq(researchHistory.userId, userId))
      .orderBy(desc(researchHistory.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();