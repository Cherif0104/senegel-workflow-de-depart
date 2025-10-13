
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  lastActivity: number;
  updateActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuration
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes en millisecondes
const SESSION_KEY = 'ecosystia_user';
const ACTIVITY_KEY = 'ecosystia_last_activity';
const CURRENT_PAGE_KEY = 'ecosystia_current_page';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Vérifier si la session est expirée
  const isSessionExpired = useCallback(() => {
    const savedActivity = localStorage.getItem(ACTIVITY_KEY);
    if (!savedActivity) return true;
    
    const lastActivityTime = parseInt(savedActivity);
    const now = Date.now();
    return (now - lastActivityTime) > SESSION_TIMEOUT;
  }, []);

  // Mettre à jour l'activité
  const updateActivity = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    localStorage.setItem(ACTIVITY_KEY, now.toString());
  }, []);

  // Logout automatique si session expirée
  const checkSessionExpiry = useCallback(() => {
    if (user && isSessionExpired()) {
      console.log('Session expirée - Déconnexion automatique');
      logout();
      return true;
    }
    return false;
  }, [user, isSessionExpired]);

  // Charger la session au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem(SESSION_KEY);
    const savedActivity = localStorage.getItem(ACTIVITY_KEY);
    
    if (savedUser && savedActivity) {
      try {
        const userData = JSON.parse(savedUser);
        const lastActivityTime = parseInt(savedActivity);
        
        // Vérifier si la session est encore valide
        if ((Date.now() - lastActivityTime) <= SESSION_TIMEOUT) {
          setUser(userData);
          setLastActivity(lastActivityTime);
          console.log('Session restaurée avec succès');
        } else {
          console.log('Session expirée - Nettoyage');
          localStorage.removeItem(SESSION_KEY);
          localStorage.removeItem(ACTIVITY_KEY);
          localStorage.removeItem(CURRENT_PAGE_KEY);
        }
      } catch (error) {
        console.error('Erreur parsing user session:', error);
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(ACTIVITY_KEY);
        localStorage.removeItem(CURRENT_PAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Surveiller l'activité utilisateur
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    // Ajouter les listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Vérifier périodiquement l'expiration
    const checkInterval = setInterval(checkSessionExpiry, 60000); // Vérifier chaque minute

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(checkInterval);
    };
  }, [user, updateActivity, checkSessionExpiry]);

  const login = (userData: User) => {
    const now = Date.now();
    setUser(userData);
    setLastActivity(now);
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    localStorage.setItem(ACTIVITY_KEY, now.toString());
    localStorage.setItem('ecosystia_is_new_login', 'true'); // Marquer comme nouvelle connexion
    
    console.log('Connexion réussie - Session créée');
  };

  const logout = () => {
    setUser(null);
    setLastActivity(Date.now());
    
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
    localStorage.removeItem(CURRENT_PAGE_KEY);
    
    console.log('Déconnexion - Session nettoyée');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, lastActivity, updateActivity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};