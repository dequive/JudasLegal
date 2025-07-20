import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Chat session routes
  app.get('/api/chat/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserChatSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });

  app.post('/api/chat/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { title } = req.body;
      
      const sessionData = {
        id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        title: title || 'Nova Conversa',
      };

      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating chat session:", error);
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  app.get('/api/chat/sessions/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getChatMessages(id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/chat/sessions/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { role, content, complexity, citations } = req.body;
      
      const messageData = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sessionId: id,
        role,
        content,
        complexity,
        citations,
      };

      const message = await storage.addChatMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error adding chat message:", error);
      res.status(500).json({ message: "Failed to add chat message" });
    }
  });

  app.delete('/api/chat/sessions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteChatSession(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting chat session:", error);
      res.status(500).json({ message: "Failed to delete chat session" });
    }
  });

  // Legal documents routes
  app.get('/api/documents', async (req, res) => {
    try {
      const { limit, offset, search } = req.query;
      
      let documents;
      if (search) {
        documents = await storage.searchLegalDocuments(search as string);
      } else {
        documents = await storage.getLegalDocuments(
          parseInt(limit as string) || 50,
          parseInt(offset as string) || 0
        );
      }
      
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get('/api/documents/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const document = await storage.getLegalDocument(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  // User preferences routes
  app.get('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.post('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferencesData = {
        id: `pref-${userId}`,
        userId,
        ...req.body,
      };

      const preferences = await storage.upsertUserPreferences(preferencesData);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ message: "Failed to update user preferences" });
    }
  });

  // Research history routes
  app.get('/api/user/research-history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { limit } = req.query;
      const history = await storage.getUserResearchHistory(
        userId,
        parseInt(limit as string) || 20
      );
      res.json(history);
    } catch (error) {
      console.error("Error fetching research history:", error);
      res.status(500).json({ message: "Failed to fetch research history" });
    }
  });

  app.post('/api/user/research-history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const historyData = {
        id: `research-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        ...req.body,
      };

      const history = await storage.addResearchHistory(historyData);
      res.json(history);
    } catch (error) {
      console.error("Error adding research history:", error);
      res.status(500).json({ message: "Failed to add research history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}