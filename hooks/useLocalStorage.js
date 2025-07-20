import { useState, useEffect } from 'react';

/**
 * Hook para persistência de dados no localStorage
 * Funciona mesmo offline e mantém estado consistente
 */
export function useLocalStorage(key, initialValue) {
  // Função para obter valor do localStorage
  const getStoredValue = () => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler localStorage para ${key}:`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Função para atualizar valor
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Erro ao salvar no localStorage para ${key}:`, error);
    }
  };

  // Sincronizar com mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Erro ao sincronizar localStorage para ${key}:`, error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Hook específico para histórico de consultas legais
 */
export function useLegalHistory() {
  const [history, setHistory] = useLocalStorage('muzaia_legal_history', []);

  const addToHistory = (query, response, citations = []) => {
    const entry = {
      id: Date.now(),
      query,
      response,
      citations,
      timestamp: new Date().toISOString(),
      favorite: false
    };

    setHistory(prev => [entry, ...prev.slice(0, 49)]); // Máximo 50 entradas
  };

  const toggleFavorite = (id) => {
    setHistory(prev => prev.map(entry => 
      entry.id === id ? { ...entry, favorite: !entry.favorite } : entry
    ));
  };

  const removeFromHistory = (id) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getFavorites = () => {
    return history.filter(entry => entry.favorite);
  };

  return {
    history,
    addToHistory,
    toggleFavorite,
    removeFromHistory,
    clearHistory,
    getFavorites
  };
}

/**
 * Hook para preferências do usuário
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage('muzaia_preferences', {
    theme: 'dark',
    language: 'pt',
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    autoSave: true,
    notifications: true
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences({
      theme: 'dark',
      language: 'pt',
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      autoSave: true,
      notifications: true
    });
  };

  return {
    preferences,
    updatePreference,
    resetPreferences
  };
}