
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { authService, AuthUser } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string; role?: Role }) => Promise<boolean>;
  register: (data: { firstName: string; lastName: string; email: string; password: string; role: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  lastActivity: number;
  updateActivity: () => void;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

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
    const loadUser = async () => {
      try {
        const authUser = await authService.getCurrentUser();
        if (authUser) {
          const userData = authService.convertToUser(authUser);
          setUser(userData);
          setLastActivity(Date.now());
          console.log('Session restaurée avec succès');
        }
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
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

  const login = async (credentials: { email: string; password: string; role?: Role }): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Mode démo : bypass de l'authentification Appwrite
      if (credentials.email === 'demo@ecosystia.sn' || credentials.password === 'demo') {
        const role = credentials.role || 'manager';
        const demoUser: User = {
          id: `demo-user-${role}`,
          firstName: 'Demo',
          lastName: 'Utilisateur',
          email: 'demo@ecosystia.sn',
          avatar: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#4F46E5"/><text x="50" y="60" font-family="Arial" font-size="40" font-weight="bold" text-anchor="middle" fill="white">${role.charAt(0).toUpperCase()}</text></svg>`)}`,
          role: role,
          skills: getRoleSkills(role),
          phone: '+221 77 000 00 00'
        };
        
        const now = Date.now();
        setUser(demoUser);
        setLastActivity(now);
        
        localStorage.setItem(SESSION_KEY, JSON.stringify(demoUser));
        localStorage.setItem(ACTIVITY_KEY, now.toString());
        localStorage.setItem('ecosystia_is_new_login', 'true');
        
        console.log(`✅ Mode démo activé - Rôle: ${role}`);
        return true;
      }
      
      // Mode production : authentification Appwrite
      const authUser = await authService.login(credentials);
      if (authUser) {
        const userData = authService.convertToUser(authUser);
        const now = Date.now();
        
        setUser(userData);
        setLastActivity(now);
        
        localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
        localStorage.setItem(ACTIVITY_KEY, now.toString());
        localStorage.setItem('ecosystia_is_new_login', 'true');
        
        console.log('Connexion réussie - Session créée');
        return true;
      }
      return false;
    } catch (error: any) {
      setError(error.message);
      console.error('Erreur de connexion:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour obtenir les compétences selon le rôle
  const getRoleSkills = (role: Role): string[] => {
    const roleSkills: Record<Role, string[]> = {
      'super_administrator': ['Administration', 'Sécurité', 'Gestion', 'Développement'],
      'administrator': ['Administration', 'Gestion', 'Sécurité'],
      'manager': ['Gestion', 'Leadership', 'Planification'],
      'team_lead': ['Leadership', 'Gestion d\'équipe', 'Planification'],
      'developer': ['Développement', 'Programmation', 'Architecture'],
      'designer': ['Design', 'UI/UX', 'Créativité'],
      'analyst': ['Analyse', 'Données', 'Reporting'],
      'tester': ['Test', 'Qualité', 'Validation'],
      'consultant': ['Conseil', 'Analyse', 'Stratégie'],
      'trainer': ['Formation', 'Pédagogie', 'Communication'],
      'support': ['Support', 'Assistance', 'Communication'],
      'sales': ['Vente', 'Commercial', 'Négociation'],
      'marketing': ['Marketing', 'Communication', 'Stratégie'],
      'hr': ['RH', 'Gestion', 'Recrutement'],
      'finance': ['Finance', 'Comptabilité', 'Analyse'],
      'legal': ['Juridique', 'Conformité', 'Réglementation'],
      'operations': ['Opérations', 'Gestion', 'Optimisation'],
      'research': ['Recherche', 'Innovation', 'Analyse'],
      'content': ['Contenu', 'Rédaction', 'Communication']
    };
    
    return roleSkills[role] || ['Général'];
  };

  const register = async (data: { firstName: string; lastName: string; email: string; password: string; role: string }): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const authUser = await authService.register({
        ...data,
        role: data.role as any
      });
      
      if (authUser) {
        const userData = authService.convertToUser(authUser);
        const now = Date.now();
        
        setUser(userData);
        setLastActivity(now);
        
        localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
        localStorage.setItem(ACTIVITY_KEY, now.toString());
        localStorage.setItem('ecosystia_is_new_login', 'true');
        
        console.log('Inscription réussie - Session créée');
        return true;
      }
      return false;
    } catch (error: any) {
      setError(error.message);
      console.error('Erreur d\'inscription:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      
      setUser(null);
      setLastActivity(Date.now());
      
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(ACTIVITY_KEY);
      localStorage.removeItem(CURRENT_PAGE_KEY);
      
      console.log('Déconnexion - Session nettoyée');
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
      // Nettoyer quand même localement
      setUser(null);
      localStorage.clear();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, lastActivity, updateActivity, error }}>
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