import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../utils/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

interface Citation {
  id: number;
  title: string;
  source: string;
  law_type: string;
  article_number?: string;
  relevance_score: number;
}

interface ChatState {
  messages: Message[];
  sessionId: string;
  isLoading: boolean;
  
  // Actions
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  initializeSession: () => void;
  sendMessage: (message: string, sessionId: string) => Promise<any>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      sessionId: '',
      isLoading: false,

      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message]
        }));
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      initializeSession: () => {
        const currentSessionId = get().sessionId;
        if (!currentSessionId) {
          const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          set({ sessionId: newSessionId });
        }
      },

      sendMessage: async (message, sessionId) => {
        try {
          const response = await apiClient.post('/api/chat/send', {
            message,
            session_id: sessionId
          });
          
          return response.data;
        } catch (error) {
          console.error('Error sending message:', error);
          throw error;
        }
      }
    }),
    {
      name: 'judas-chat-store',
      partialize: (state) => ({
        messages: state.messages,
        sessionId: state.sessionId
      })
    }
  )
);
