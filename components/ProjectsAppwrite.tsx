/**
 * 📊 MODULE PROJETS - ECOSYSTIA (VERSION APPWRITE)
 * Gestion complète des projets avec persistance Appwrite
 * Référence : MERISE/02-MLD-MPD-IMPLEMENTATION-APPWRITE.md - Collection 2
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { Project, Task, Risk, User, TimeLog } from '../types';
import { projectService } from '../services/projectService';
import LogTimeModal from './LogTimeModal';
import ConfirmationModal from './common/ConfirmationModal';
import ProjectFormModal from './ProjectFormModal';
import TeamManagementModal from './TeamManagementModal';
import ProjectDetailModal from './ProjectDetailModal';

// Styles pour les statuts et priorités
const statusColors = {
  'Not Started': 'bg-gray-500',
  'In Progress': 'bg-blue-500',
  'Completed': 'bg-green-500',
  'On Hold': 'bg-yellow-500',
  'Cancelled': 'bg-red-500',
};

const priorityColors = {
  'Critical': 'bg-red-600',
  'High': 'bg-red-500',
  'Medium': 'bg-yellow-500',
  'Low': 'bg-green-500',
};

// Interface pour les props
interface ProjectsAppwriteProps {
  timeLogs: TimeLog[];
  onAddTimeLog: (log: Omit<TimeLog, 'id' | 'userId'>) => void;
}

// Composant ProjectCard moderne
const ProjectCard: React.FC<{
  project: Project;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}> = ({ project, canManage, onEdit, onDelete, onView }) => {
  const { t } = useLocalization();
  const isOverdue = new Date(project.dueDate) < new Date() && project.status !== 'Completed';
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${statusColors[project.status]}`}>
              {project.status}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${priorityColors[project.priority]}`}>
              {project.priority}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Échéance:</span>
            <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
              {new Date(project.dueDate).toLocaleDateString()}
            </span>
          </div>
          
          {project.budget && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Budget:</span>
              <span className="font-medium text-gray-900">{project.budget.toLocaleString()} FCFA</span>
            </div>
          )}
          
          {project.client && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Client:</span>
              <span className="font-medium text-gray-900">{project.client}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Équipe ({project.team.length})</span>
          </div>
          <div className="flex -space-x-2">
            {project.team.slice(0, 5).map((member) => (
              <img 
                key={member.id} 
                src={member.avatar} 
                alt={member.name} 
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm" 
                title={`${member.name} (${member.role})`} 
              />
            ))}
            {project.team.length > 5 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                +{project.team.length - 5}
              </div>
            )}
          </div>
        </div>
        
        {project.tags && project.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{project.tags.length - 3}</span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
          >
            <i className="fas fa-eye mr-1"></i>
            Voir
          </button>
          {canManage && (
            <>
              <button
                onClick={onEdit}
                className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center transition-colors"
              >
                <i className="fas fa-edit mr-1"></i>
                Modifier
              </button>
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center transition-colors"
              >
                <i className="fas fa-trash mr-1"></i>
                Supprimer
              </button>
            </>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          {project.tasks.length} tâche{project.tasks.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

// Composant principal ProjectsAppwrite
const ProjectsAppwrite: React.FC<ProjectsAppwriteProps> = ({ timeLogs, onAddTimeLog }) => {
  const { t } = useLocalization();
  const { user: currentUser } = useAuth();
  
  // États pour la gestion des projets
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les modales
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isTeamModalOpen, setTeamModalOpen] = useState(false);
  const [projectForTeam, setProjectForTeam] = useState<Project | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [projectForDetail, setProjectForDetail] = useState<Project | null>(null);
  
  // États pour le filtrage et tri
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'dueDate' | 'priority' | 'status'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const canManage = currentUser?.role === 'manager' || currentUser?.role === 'administrator' || currentUser?.role === 'super_administrator';

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les projets
      const projectsData = await projectService.getAll();
      
      setProjects(projectsData);
      // Pour l'instant, utiliser des utilisateurs mock
      setUsers([
        {
          id: '1',
          firstName: 'Admin',
          lastName: 'Principal',
          email: 'admin@ecosystia.sn',
          avatar: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=AP',
          role: 'super_administrator',
          skills: ['Gestion', 'Administration'],
          phone: '+221 77 123 45 67'
        },
        {
          id: '2',
          firstName: 'Manager',
          lastName: 'Projet',
          email: 'manager@ecosystia.sn',
          avatar: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=MP',
          role: 'manager',
          skills: ['Gestion de projet', 'Leadership'],
          phone: '+221 77 234 56 78'
        }
      ]);
      
      console.log(`✅ ${projectsData.length} projets chargés`);
    } catch (error: any) {
      console.error('❌ Erreur chargement données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Gestion des projets
  const handleSaveProject = async (projectData: Project | Omit<Project, 'id'>) => {
    try {
      setError(null);
      
      if ('id' in projectData) {
        // Mise à jour
        const updatedProject = await projectService.update(projectData.id, projectData);
        if (updatedProject) {
          setProjects(prev => prev.map(p => p.id === projectData.id ? updatedProject : p));
          console.log('✅ Projet mis à jour');
        }
      } else {
        // Création
        if (!currentUser) throw new Error('Utilisateur non connecté');
        const newProject = await projectService.create(projectData, currentUser.id);
        if (newProject) {
          setProjects(prev => [...prev, newProject]);
          console.log('✅ Projet créé');
        }
      }
      
      setFormModalOpen(false);
      setEditingProject(null);
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde projet:', error);
      
      // Mode démo : gérer l'erreur différemment
      if (currentUser?.id?.startsWith('demo-user-')) {
        console.log('🔄 Mode démo - Simulation de la sauvegarde');
        
        if ('id' in projectData) {
          // Mise à jour en mode démo
          const existingProjects = JSON.parse(localStorage.getItem('ecosystia_demo_projects') || '[]');
          const updatedProjects = existingProjects.map((p: Project) => 
            p.id === projectData.id ? { ...p, ...projectData, updatedAt: new Date().toISOString() } : p
          );
          localStorage.setItem('ecosystia_demo_projects', JSON.stringify(updatedProjects));
          setProjects(updatedProjects);
          console.log('✅ Projet mis à jour en mode démo');
        } else {
          // Création en mode démo
          const demoProject: Project = {
            ...projectData as Omit<Project, 'id'>,
            id: `demo-project-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          const existingProjects = JSON.parse(localStorage.getItem('ecosystia_demo_projects') || '[]');
          const updatedProjects = [...existingProjects, demoProject];
          localStorage.setItem('ecosystia_demo_projects', JSON.stringify(updatedProjects));
          setProjects(updatedProjects);
          console.log('✅ Projet créé en mode démo');
        }
        
        setFormModalOpen(false);
        setEditingProject(null);
      } else {
        setError('Erreur lors de la sauvegarde du projet');
      }
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      setError(null);
      const success = await projectService.delete(projectId);
      if (success) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setDeleteModalOpen(false);
        setProjectToDelete(null);
        console.log('✅ Projet supprimé');
      }
    } catch (error: any) {
      console.error('❌ Erreur suppression projet:', error);
      
      // Mode démo : gérer l'erreur différemment
      if (currentUser?.id?.startsWith('demo-user-')) {
        console.log('🔄 Mode démo - Simulation de la suppression');
        
        // Supprimer du localStorage
        const existingProjects = JSON.parse(localStorage.getItem('ecosystia_demo_projects') || '[]');
        const updatedProjects = existingProjects.filter((p: Project) => p.id !== projectId);
        localStorage.setItem('ecosystia_demo_projects', JSON.stringify(updatedProjects));
        
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setDeleteModalOpen(false);
        setProjectToDelete(null);
        console.log('✅ Projet supprimé en mode démo');
      } else {
        setError('Erreur lors de la suppression du projet');
      }
    }
  };

  const handleOpenTeamModal = (project: Project) => {
    setProjectForTeam(project);
    setTeamModalOpen(true);
  };

  const handleCloseTeamModal = () => {
    setTeamModalOpen(false);
    setProjectForTeam(null);
  };

  const handleTeamUpdate = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleOpenDetail = (project: Project) => {
    setProjectForDetail(project);
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setProjectForDetail(null);
  };

  const handleOpenForm = (project: Project | null = null) => {
    setEditingProject(project);
    setFormModalOpen(true);
  };

  const handleOpenDelete = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteModalOpen(true);
  };

  // Filtrage et tri des projets
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
          break;
        case 'priority':
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'status':
          const statusOrder = { 'Not Started': 1, 'In Progress': 2, 'Completed': 3, 'On Hold': 4, 'Cancelled': 5 };
          aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
          bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [projects, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  // Statistiques des projets
  const projectStats = useMemo(() => {
    const total = projects.length;
    const byStatus = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byPriority = projects.reduce((acc, project) => {
      acc[project.priority] = (acc[project.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const overdue = projects.filter(p => new Date(p.dueDate) < new Date() && p.status !== 'Completed').length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      byStatus,
      byPriority,
      overdue,
      completed,
      completionRate
    };
  }, [projects]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec navigation */}
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button className="hover:text-blue-600 transition-colors flex items-center">
            <i className="fas fa-home mr-1"></i>
            Dashboard
          </button>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-900 font-medium">Projets</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <i className="fas fa-project-diagram mr-3 text-blue-600"></i>
              {t('project_management_title')}
            </h1>
            <p className="mt-1 text-gray-600">
              Gérez vos projets et collaborez avec votre équipe
            </p>
          </div>
          {canManage && (
            <button
              onClick={() => handleOpenForm(null)}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              {t('new_project')}
            </button>
          )}
        </div>
      </div>
      
      {/* Message d'erreur */}
      {error && (
        <div className="mx-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}
      
      {/* Statistiques des projets */}
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Projets</p>
                <p className="text-3xl font-bold">{projectStats.total}</p>
              </div>
              <i className="fas fa-project-diagram text-4xl text-blue-200"></i>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Terminés</p>
                <p className="text-3xl font-bold">{projectStats.completed}</p>
              </div>
              <i className="fas fa-check-circle text-4xl text-emerald-200"></i>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">En Retard</p>
                <p className="text-3xl font-bold">{projectStats.overdue}</p>
              </div>
              <i className="fas fa-exclamation-triangle text-4xl text-yellow-200"></i>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Taux de Réussite</p>
                <p className="text-3xl font-bold">{projectStats.completionRate}%</p>
              </div>
              <i className="fas fa-chart-line text-4xl text-purple-200"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="px-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            
            {/* Filtres */}
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">Tous les statuts</option>
                <option value="Not Started">Non démarré</option>
                <option value="In Progress">En cours</option>
                <option value="Completed">Terminé</option>
                <option value="On Hold">En pause</option>
                <option value="Cancelled">Annulé</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">Toutes les priorités</option>
                <option value="Critical">Critique</option>
                <option value="High">Élevée</option>
                <option value="Medium">Moyenne</option>
                <option value="Low">Faible</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="dueDate">Trier par échéance</option>
                <option value="title">Trier par titre</option>
                <option value="priority">Trier par priorité</option>
                <option value="status">Trier par statut</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                title={sortOrder === 'asc' ? 'Tri croissant' : 'Tri décroissant'}
              >
                <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
              </button>
            </div>
            
            {/* Modes d'affichage */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 rounded-xl transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-xl transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-list"></i>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-4 py-3 rounded-xl transition-colors ${
                  viewMode === 'kanban' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-columns"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Affichage des projets */}
      <div className="px-6">
        {filteredAndSortedProjects.length > 0 ? (
          <div className="space-y-6">
            {/* Vue Grille */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    canManage={canManage}
                    onEdit={() => handleOpenForm(project)}
                    onDelete={() => handleOpenDelete(project.id)}
                    onView={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            )}
            
            {/* Vue Liste */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projet</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedProjects.map(project => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{project.title}</div>
                              <div className="text-sm text-gray-500">{project.description.substring(0, 60)}...</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full text-white ${statusColors[project.status]}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full text-white ${priorityColors[project.priority]}`}>
                              {project.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(project.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member) => (
                                <img key={member.id} src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full border-2 border-white" title={member.name} />
                              ))}
                              {project.team.length > 3 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-bold">
                                  +{project.team.length - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button onClick={() => handleOpenDetail(project)} className="text-blue-600 hover:text-blue-900">Voir</button>
                            <button onClick={() => handleOpenTeamModal(project)} className="text-purple-600 hover:text-purple-900">Équipe</button>
                            {canManage && (
                              <>
                                <button onClick={() => handleOpenForm(project)} className="text-emerald-600 hover:text-emerald-900">Modifier</button>
                                <button onClick={() => handleOpenDelete(project.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Vue Kanban */}
            {viewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'].map(status => (
                  <div key={status} className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${statusColors[status]}`}></span>
                      {status}
                      <span className="ml-2 text-sm text-gray-500">
                        ({filteredAndSortedProjects.filter(p => p.status === status).length})
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {filteredAndSortedProjects
                        .filter(project => project.status === status)
                        .map(project => (
                          <div key={project.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedProject(project)}>
                            <h4 className="font-medium text-gray-900 text-sm mb-2">{project.title}</h4>
                            <p className="text-xs text-gray-600 mb-3">{project.description.substring(0, 80)}...</p>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 text-xs rounded-full text-white ${priorityColors[project.priority]}`}>
                                {project.priority}
                              </span>
                              <span className="text-xs text-gray-500">{new Date(project.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-3 flex -space-x-2">
                              {project.team.slice(0, 3).map((member) => (
                                <img key={member.id} src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full border-2 border-white" title={member.name} />
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12">
              <i className="fas fa-search text-6xl text-gray-300 mb-6"></i>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' ? 'Aucun projet trouvé' : 'Aucun projet'}
              </h3>
              <p className="text-gray-500 mb-8">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche ou de filtrage.'
                  : 'Commencez par créer votre premier projet pour organiser votre travail.'
                }
              </p>
              <div className="flex justify-center gap-4">
                {canManage && (
                  <button
                    onClick={() => handleOpenForm(null)}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    {t('create_first_project')}
                  </button>
                )}
                {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center"
                  >
                    <i className="fas fa-times mr-2"></i>
                    Effacer les filtres
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      {isFormModalOpen && (
        <ProjectFormModal
          project={editingProject}
          users={users}
          onClose={() => {
            setFormModalOpen(false);
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
        />
      )}

      {isDeleteModalOpen && projectToDelete && (
        <ConfirmationModal 
          title="Supprimer le projet"
          message="Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible."
          onConfirm={() => handleDeleteProject(projectToDelete)}
          onCancel={() => {
            setDeleteModalOpen(false);
            setProjectToDelete(null);
          }}
        />
      )}

      {/* Modal de gestion d'équipe */}
      {isTeamModalOpen && projectForTeam && (
        <TeamManagementModal
          project={projectForTeam}
          availableUsers={users}
          onClose={handleCloseTeamModal}
          onUpdate={handleTeamUpdate}
        />
      )}

      {/* Modal de détails du projet */}
      {isDetailModalOpen && projectForDetail && (
        <ProjectDetailModal
          project={projectForDetail}
          onClose={handleCloseDetail}
          onEdit={handleOpenForm}
          onDelete={handleOpenDelete}
          onManageTeam={handleOpenTeamModal}
          canManage={canManage}
        />
      )}
    </div>
  );
};

export default ProjectsAppwrite;
