import { useState } from 'react';

interface HeaderProps {
  isOnline: boolean;
}

export default function Header({ isOnline }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Judas</h1>
                <p className="text-xs text-gray-500">Assistente Jurídico</p>
              </div>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center space-x-4">
            {/* Online/Offline indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                Início
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                Sobre
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                Ajuda
              </a>
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-gray-600 hover:text-green-600 py-2 transition-colors duration-200">
                Início
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 py-2 transition-colors duration-200">
                Sobre
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 py-2 transition-colors duration-200">
                Ajuda
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
