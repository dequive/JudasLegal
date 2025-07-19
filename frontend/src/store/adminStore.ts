import { create } from 'zustand';

interface LoginCredentials {
  username: string;
  password: string;
}

interface DocumentMetadata {
  title: string;
  law_type: string;
  source: string;
  description?: string;
}

interface UploadedDocument {
  id: number;
  title: string;
  law_type: string;
  source: string;
  processing_status: string;
  chunks_count: number;
  uploaded_at: string;
  uploaded_by_username: string;
  file_size?: number;
  original_filename: string;
}

interface UploadStats {
  total_documents: number;
  completed_documents: number;
  error_documents: number;
  processing_documents: number;
  total_chunks: number;
  success_rate: number;
}

interface AdminState {
  token: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  username: string | null;
  uploadedDocuments: UploadedDocument[];
  stats: UploadStats | null;
  
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  uploadDocument: (file: File, metadata: DocumentMetadata) => Promise<void>;
  fetchDocuments: () => Promise<void>;
  fetchStats: () => Promise<void>;
  deleteDocument: (id: number) => Promise<void>;
  setToken: (token: string, role: string, username: string) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('admin_token') : false,
  userRole: typeof window !== 'undefined' ? localStorage.getItem('user_role') : null,
  username: typeof window !== 'undefined' ? localStorage.getItem('username') : null,
  uploadedDocuments: [],
  stats: null,

  setToken: (token: string, role: string, username: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('user_role', role);
      localStorage.setItem('username', username);
    }
    
    set({
      token,
      isAuthenticated: true,
      userRole: role,
      username
    });
  },

  login: async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    get().setToken(data.access_token, data.role, data.username);
    
    // Carregar dados iniciais
    await Promise.all([
      get().fetchDocuments(),
      get().fetchStats()
    ]);
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('username');
    }
    
    set({
      token: null,
      isAuthenticated: false,
      userRole: null,
      username: null,
      uploadedDocuments: [],
      stats: null
    });
  },

  uploadDocument: async (file, metadata) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const response = await fetch('/api/admin/upload-document', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${get().token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }
    
    // Atualizar lista de documentos e estatísticas
    await Promise.all([
      get().fetchDocuments(),
      get().fetchStats()
    ]);
  },

  fetchDocuments: async () => {
    const response = await fetch('/api/admin/documents', {
      headers: {
        'Authorization': `Bearer ${get().token}`
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar documentos');
    }

    const documents = await response.json();
    set({ uploadedDocuments: documents });
  },

  fetchStats: async () => {
    const response = await fetch('/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${get().token}`
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar estatísticas');
    }

    const stats = await response.json();
    set({ stats });
  },

  deleteDocument: async (id: number) => {
    const response = await fetch(`/api/admin/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${get().token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Falha ao remover documento');
    }

    // Atualizar lista de documentos e estatísticas
    await Promise.all([
      get().fetchDocuments(),
      get().fetchStats()
    ]);
  }
}));