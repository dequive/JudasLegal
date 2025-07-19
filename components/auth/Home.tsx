import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import ChatInterface from '@/components/Chat/ChatInterface';
// import { LogOut, User } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user info */}
      <header className="bg-gray-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Judas Legal Assistant
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-gray-600 text-sm">U</div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.email || 'Usuário'
                      }
                    </p>
                  </div>
                </div>
              )}
              <a
                href="/api/logout"
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Sair</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main chat interface */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-50 rounded-lg shadow-sm">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
};

export default Home;