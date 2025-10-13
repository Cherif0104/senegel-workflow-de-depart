/**
 * Hook personnalisé pour gérer la navigation et la persistance de la page courante
 * Évite le flash de Login et maintient la position après refresh
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CURRENT_PAGE_KEY = 'ecosystia_current_page';
const IS_NEW_LOGIN_KEY = 'ecosystia_is_new_login';
const DEFAULT_PAGE = 'dashboard';

export const useNavigation = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>(DEFAULT_PAGE);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  // Charger la page courante au démarrage
  useEffect(() => {
    if (!isLoading && user) {
      const isNewLogin = localStorage.getItem(IS_NEW_LOGIN_KEY) === 'true';
      
      if (isNewLogin) {
        // Nouvelle connexion -> toujours Dashboard
        setCurrentPage(DEFAULT_PAGE);
        localStorage.setItem(CURRENT_PAGE_KEY, DEFAULT_PAGE);
        localStorage.removeItem(IS_NEW_LOGIN_KEY);
        console.log('Nouvelle connexion -> Redirection Dashboard');
      } else {
        // Refresh -> restaurer la page précédente
        const savedPage = localStorage.getItem(CURRENT_PAGE_KEY);
        if (savedPage && savedPage !== currentPage) {
          setCurrentPage(savedPage);
          console.log('Page courante restaurée:', savedPage);
        }
      }
      
      // Petit délai pour éviter le flash
      setTimeout(() => {
        setIsLoadingPage(false);
      }, 300);
    } else if (!isLoading && !user) {
      setIsLoadingPage(false);
    }
  }, [isLoading, user, currentPage]);

  // Sauvegarder la page courante
  const saveCurrentPage = useCallback((page: string) => {
    setCurrentPage(page);
    localStorage.setItem(CURRENT_PAGE_KEY, page);
    console.log('Page courante sauvegardée:', page);
  }, []);

  // Navigation avec sauvegarde
  const navigateTo = useCallback((page: string) => {
    setIsNavigating(true);
    saveCurrentPage(page);
    
    // Petit délai pour l'animation
    setTimeout(() => {
      setIsNavigating(false);
    }, 100);
  }, [saveCurrentPage]);

  // Retourner à la page par défaut (dashboard)
  const goToDefault = useCallback(() => {
    navigateTo(DEFAULT_PAGE);
  }, [navigateTo]);

  // Obtenir la page à afficher (évite le flash)
  const getDisplayPage = useCallback(() => {
    if (isLoading || isLoadingPage) return 'loading';
    if (!user) return 'auth';
    return currentPage;
  }, [isLoading, isLoadingPage, user, currentPage]);

  return {
    currentPage,
    isNavigating,
    isLoadingPage,
    navigateTo,
    goToDefault,
    getDisplayPage,
    saveCurrentPage
  };
};
