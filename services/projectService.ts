/**
 * 📁 SERVICE PROJECTS - ECOSYSTIA
 * Gestion complète des projets avec Appwrite
 */

import { databases, DATABASE_ID, COLLECTION_IDS, ID, Query } from './appwriteService';
import { Project, Task, Risk, User } from '../types';

class ProjectService {
  private get collectionId() {
    return 'projects';
  }

  /**
   * Convertir un document Appwrite en Project
   */
  private mapFromAppwrite(doc: any): Project {
    return {
      id: doc.$id,
      title: doc.title,
      description: doc.description,
      status: doc.status,
      priority: doc.priority || 'Medium',
      dueDate: doc.dueDate,
      budget: doc.budget,
      client: doc.client,
      tags: doc.tags ? JSON.parse(doc.tags) : [],
      team: doc.team ? JSON.parse(doc.team) : [],
      tasks: doc.tasks ? JSON.parse(doc.tasks) : [],
      risks: doc.risks ? JSON.parse(doc.risks) : [],
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    };
  }

  /**
   * Convertir un Project en document Appwrite
   */
  private mapToAppwrite(project: Partial<Project>): any {
    const data: any = {};
    
    if (project.title !== undefined) data.title = project.title;
    if (project.description !== undefined) data.description = project.description;
    if (project.status !== undefined) data.status = project.status;
    if (project.priority !== undefined) data.priority = project.priority;
    if (project.dueDate !== undefined) data.dueDate = project.dueDate;
    if (project.budget !== undefined) data.budget = project.budget;
    if (project.client !== undefined) data.client = project.client;
    if (project.tags !== undefined) data.tags = JSON.stringify(project.tags);
    if (project.team !== undefined) data.team = JSON.stringify(project.team);
    if (project.tasks !== undefined) data.tasks = JSON.stringify(project.tasks);
    if (project.risks !== undefined) data.risks = JSON.stringify(project.risks);
    
    return data;
  }

  /**
   * Créer un nouveau projet
   */
  async create(projectData: Omit<Project, 'id'>, userId: string): Promise<Project | null> {
    try {
      // Mode démo : simuler la création avec persistance
      if (this.isDemoMode()) {
        const demoProject: Project = {
          ...projectData,
          id: `demo-project-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Charger les projets existants et ajouter le nouveau
        const existingProjects = this.loadDemoProjects();
        const updatedProjects = [...existingProjects, demoProject];
        this.saveDemoProjects(updatedProjects);
        
        console.log('✅ Projet créé en mode démo et sauvegardé:', demoProject.id);
        return demoProject;
      }

      // Mode production : création dans Appwrite
      const appwriteData = this.mapToAppwrite(projectData);
      appwriteData.userId = userId; // Pour filtrage par utilisateur
      
      const response = await databases.createDocument(
        DATABASE_ID,
        this.collectionId,
        ID.unique(),
        appwriteData
      );
      
      console.log('✅ Projet créé dans Appwrite:', response.$id);
      return this.mapFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur création projet:', error);
      
      // Mode démo : fallback vers simulation
      if (this.isDemoMode()) {
        const demoProject: Project = {
          ...projectData,
          id: `demo-project-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('✅ Projet créé en mode démo (fallback):', demoProject.id);
        return demoProject;
      }
      
      throw error;
    }
  }

  /**
   * Vérifier si on est en mode démo
   */
  private isDemoMode(): boolean {
    // Vérifier si l'utilisateur actuel est un utilisateur démo
    const user = JSON.parse(localStorage.getItem('ecosystia_user') || '{}');
    return user.id && user.id.startsWith('demo-user-');
  }

  /**
   * Sauvegarder les projets démo dans localStorage
   */
  private saveDemoProjects(projects: Project[]): void {
    localStorage.setItem('ecosystia_demo_projects', JSON.stringify(projects));
  }

  /**
   * Charger les projets démo depuis localStorage
   */
  private loadDemoProjects(): Project[] {
    const saved = localStorage.getItem('ecosystia_demo_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('❌ Erreur chargement projets démo:', error);
      }
    }
    return this.getDemoProjects();
  }

  /**
   * Récupérer tous les projets d'un utilisateur
   */
  async getByUser(userId: string): Promise<Project[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId,
        [Query.equal('userId', userId)]
      );
      
      console.log(`✅ ${response.documents.length} projets récupérés pour l'utilisateur ${userId}`);
      return response.documents.map(doc => this.mapFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération projets utilisateur:', error);
      return [];
    }
  }

  /**
   * Récupérer tous les projets
   */
  async getAll(): Promise<Project[]> {
    try {
      // Mode démo : retourner des projets persistants
      if (this.isDemoMode()) {
        const projects = this.loadDemoProjects();
        console.log(`🔄 Mode démo - ${projects.length} projets chargés depuis localStorage`);
        return projects;
      }

      // Mode production : récupération depuis Appwrite
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId
      );
      
      console.log(`✅ ${response.documents.length} projets récupérés`);
      return response.documents.map(doc => this.mapFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération tous les projets:', error);
      
      // Mode démo : fallback vers projets persistants
      if (this.isDemoMode()) {
        const projects = this.loadDemoProjects();
        console.log(`🔄 Mode démo - Fallback vers ${projects.length} projets persistants`);
        return projects;
      }
      
      return [];
    }
  }

  /**
   * Projets de démonstration
   */
  private getDemoProjects(): Project[] {
    return [
      {
        id: 'demo-project-1',
        title: 'Site Web Ecosystia',
        description: 'Développement du site web principal de la plateforme Ecosystia avec interface moderne et responsive.',
        status: 'In Progress',
        priority: 'High',
        dueDate: '2024-12-31',
        budget: 2500000,
        client: 'Ecosystia',
        tags: ['Web', 'React', 'TypeScript'],
        team: [
          {
            id: '1',
            firstName: 'Demo',
            lastName: 'Utilisateur',
            email: 'demo@ecosystia.sn',
            avatar: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#4F46E5"/><text x="50" y="60" font-family="Arial" font-size="40" font-weight="bold" text-anchor="middle" fill="white">DU</text></svg>`)}`,
            role: 'manager',
            skills: ['Gestion', 'Développement'],
            phone: '+221 77 000 00 00'
          }
        ],
        tasks: [
          {
            id: 'task-1',
            text: 'Créer la maquette UI/UX',
            status: 'Done',
            priority: 'High',
            assignee: {
              id: '1',
              firstName: 'Demo',
              lastName: 'Utilisateur',
              email: 'demo@ecosystia.sn',
              avatar: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#4F46E5"/><text x="50" y="60" font-family="Arial" font-size="40" font-weight="bold" text-anchor="middle" fill="white">DU</text></svg>`)}`,
              role: 'manager',
              skills: ['Gestion', 'Développement'],
              phone: '+221 77 000 00 00'
            },
            dueDate: '2024-11-15',
            estimatedTime: 8,
            loggedTime: 8
          },
          {
            id: 'task-2',
            text: 'Développer les composants React',
            status: 'In Progress',
            priority: 'High',
            assignee: {
              id: '1',
              firstName: 'Demo',
              lastName: 'Utilisateur',
              email: 'demo@ecosystia.sn',
              avatar: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#4F46E5"/><text x="50" y="60" font-family="Arial" font-size="40" font-weight="bold" text-anchor="middle" fill="white">DU</text></svg>`)}`,
              role: 'manager',
              skills: ['Gestion', 'Développement'],
              phone: '+221 77 000 00 00'
            },
            dueDate: '2024-12-01',
            estimatedTime: 16,
            loggedTime: 4
          }
        ],
        risks: [
          {
            id: 'risk-1',
            description: 'Retard possible sur la livraison',
            likelihood: 'Medium',
            impact: 'High',
            mitigationStrategy: 'Ajouter un développeur supplémentaire'
          }
        ],
        createdAt: '2024-11-01T00:00:00.000Z',
        updatedAt: '2024-11-14T00:00:00.000Z'
      },
      {
        id: 'demo-project-2',
        title: 'Application Mobile',
        description: 'Développement d\'une application mobile pour iOS et Android avec React Native.',
        status: 'Not Started',
        priority: 'Medium',
        dueDate: '2025-03-31',
        budget: 1800000,
        client: 'Ecosystia',
        tags: ['Mobile', 'React Native', 'iOS', 'Android'],
        team: [
          {
            id: '1',
            firstName: 'Demo',
            lastName: 'Utilisateur',
            email: 'demo@ecosystia.sn',
            avatar: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#4F46E5"/><text x="50" y="60" font-family="Arial" font-size="40" font-weight="bold" text-anchor="middle" fill="white">DU</text></svg>`)}`,
            role: 'manager',
            skills: ['Gestion', 'Développement'],
            phone: '+221 77 000 00 00'
          }
        ],
        tasks: [],
        risks: [],
        createdAt: '2024-11-01T00:00:00.000Z',
        updatedAt: '2024-11-01T00:00:00.000Z'
      },
      {
        id: 'demo-project-3',
        title: 'API Backend',
        description: 'Développement de l\'API REST pour la plateforme avec Node.js et Express.',
        status: 'Completed',
        priority: 'High',
        dueDate: '2024-10-31',
        budget: 1200000,
        client: 'Ecosystia',
        tags: ['API', 'Node.js', 'Express', 'MongoDB'],
        team: [
          {
            id: '1',
            firstName: 'Demo',
            lastName: 'Utilisateur',
            email: 'demo@ecosystia.sn',
            avatar: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#4F46E5"/><text x="50" y="60" font-family="Arial" font-size="40" font-weight="bold" text-anchor="middle" fill="white">DU</text></svg>`)}`,
            role: 'manager',
            skills: ['Gestion', 'Développement'],
            phone: '+221 77 000 00 00'
          }
        ],
        tasks: [
          {
            id: 'task-3',
            text: 'Créer les endpoints API',
            status: 'Done',
            priority: 'High',
            assignee: {
              id: '1',
              firstName: 'Demo',
              lastName: 'Utilisateur',
              email: 'demo@ecosystia.sn',
              avatar: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#4F46E5"/><text x="50" y="60" font-family="Arial" font-size="40" font-weight="bold" text-anchor="middle" fill="white">DU</text></svg>`)}`,
              role: 'manager',
              skills: ['Gestion', 'Développement'],
              phone: '+221 77 000 00 00'
            },
            dueDate: '2024-10-15',
            estimatedTime: 12,
            loggedTime: 12
          }
        ],
        risks: [],
        createdAt: '2024-09-01T00:00:00.000Z',
        updatedAt: '2024-10-31T00:00:00.000Z'
      }
    ];
  }

  /**
   * Récupérer un projet par ID
   */
  async getById(id: string): Promise<Project | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        this.collectionId,
        id
      );
      
      console.log('✅ Projet récupéré:', id);
      return this.mapFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur récupération projet:', error);
      return null;
    }
  }

  /**
   * Mettre à jour un projet
   */
  async update(id: string, projectData: Partial<Project>): Promise<Project | null> {
    try {
      // Mode démo : mise à jour avec persistance
      if (this.isDemoMode()) {
        const existingProjects = this.loadDemoProjects();
        const projectIndex = existingProjects.findIndex(p => p.id === id);
        
        if (projectIndex === -1) {
          throw new Error('Projet non trouvé');
        }
        
        const updatedProject: Project = {
          ...existingProjects[projectIndex],
          ...projectData,
          id: id, // Conserver l'ID original
          updatedAt: new Date().toISOString()
        };
        
        // Mettre à jour la liste et sauvegarder
        existingProjects[projectIndex] = updatedProject;
        this.saveDemoProjects(existingProjects);
        
        console.log('✅ Projet mis à jour en mode démo et sauvegardé:', id);
        return updatedProject;
      }

      // Mode production : mise à jour dans Appwrite
      const appwriteData = this.mapToAppwrite(projectData);
      
      const response = await databases.updateDocument(
        DATABASE_ID,
        this.collectionId,
        id,
        appwriteData
      );
      
      console.log('✅ Projet mis à jour dans Appwrite:', id);
      return this.mapFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur mise à jour projet:', error);
      throw error;
    }
  }

  /**
   * Supprimer un projet
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Mode démo : suppression avec persistance
      if (this.isDemoMode()) {
        const existingProjects = this.loadDemoProjects();
        const filteredProjects = existingProjects.filter(p => p.id !== id);
        
        if (filteredProjects.length === existingProjects.length) {
          throw new Error('Projet non trouvé');
        }
        
        this.saveDemoProjects(filteredProjects);
        console.log('✅ Projet supprimé en mode démo et sauvegardé:', id);
        return true;
      }

      // Mode production : suppression dans Appwrite
      await databases.deleteDocument(
        DATABASE_ID,
        this.collectionId,
        id
      );
      
      console.log('✅ Projet supprimé de Appwrite:', id);
      return true;
    } catch (error) {
      console.error('❌ Erreur suppression projet:', error);
      return false;
    }
  }

  /**
   * Ajouter un membre à l'équipe du projet
   */
  async addTeamMember(projectId: string, member: User): Promise<Project | null> {
    try {
      const project = await this.getById(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }

      // Vérifier si le membre n'est pas déjà dans l'équipe
      const isAlreadyMember = project.team.some(m => m.id === member.id);
      if (isAlreadyMember) {
        throw new Error('Ce membre fait déjà partie de l\'équipe');
      }

      const updatedTeam = [...project.team, member];
      return await this.update(projectId, { team: updatedTeam });
    } catch (error) {
      console.error('❌ Erreur ajout membre équipe:', error);
      throw error;
    }
  }

  /**
   * Supprimer un membre de l'équipe du projet
   */
  async removeTeamMember(projectId: string, memberId: string): Promise<Project | null> {
    try {
      const project = await this.getById(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }

      const updatedTeam = project.team.filter(member => member.id !== memberId);
      return await this.update(projectId, { team: updatedTeam });
    } catch (error) {
      console.error('❌ Erreur suppression membre équipe:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les informations d'un membre de l'équipe
   */
  async updateTeamMember(projectId: string, memberId: string, updatedMember: Partial<User>): Promise<Project | null> {
    try {
      const project = await this.getById(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }

      const updatedTeam = project.team.map(member => 
        member.id === memberId ? { ...member, ...updatedMember } : member
      );
      return await this.update(projectId, { team: updatedTeam });
    } catch (error) {
      console.error('❌ Erreur mise à jour membre équipe:', error);
      throw error;
    }
  }

  /**
   * Ajouter une tâche à un projet
   */
  async addTask(projectId: string, task: Task): Promise<Project | null> {
    try {
      const project = await this.getById(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }

      const updatedTasks = [...project.tasks, task];
      return await this.update(projectId, { tasks: updatedTasks });
    } catch (error) {
      console.error('❌ Erreur ajout tâche:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une tâche
   */
  async updateTask(projectId: string, taskId: string, taskData: Partial<Task>): Promise<Project | null> {
    try {
      const project = await this.getById(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }

      const updatedTasks = project.tasks.map(task =>
        task.id === taskId ? { ...task, ...taskData } : task
      );
      
      return await this.update(projectId, { tasks: updatedTasks });
    } catch (error) {
      console.error('❌ Erreur mise à jour tâche:', error);
      throw error;
    }
  }

  /**
   * Supprimer une tâche
   */
  async deleteTask(projectId: string, taskId: string): Promise<Project | null> {
    try {
      const project = await this.getById(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }

      const updatedTasks = project.tasks.filter(task => task.id !== taskId);
      return await this.update(projectId, { tasks: updatedTasks });
    } catch (error) {
      console.error('❌ Erreur suppression tâche:', error);
      throw error;
    }
  }

  /**
   * Ajouter un risque
   */
  async addRisk(projectId: string, risk: Risk): Promise<Project | null> {
    try {
      const project = await this.getById(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }

      const updatedRisks = [...project.risks, risk];
      return await this.update(projectId, { risks: updatedRisks });
    } catch (error) {
      console.error('❌ Erreur ajout risque:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un risque
   */
  async updateRisk(projectId: string, riskId: string, riskData: Partial<Risk>): Promise<Project | null> {
    try {
      const project = await this.getById(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }

      const updatedRisks = project.risks.map(risk =>
        risk.id === riskId ? { ...risk, ...riskData } : risk
      );
      
      return await this.update(projectId, { risks: updatedRisks });
    } catch (error) {
      console.error('❌ Erreur mise à jour risque:', error);
      throw error;
    }
  }

  /**
   * Supprimer un risque
   */
  async deleteRisk(projectId: string, riskId: string): Promise<Project | null> {
    try {
      const project = await this.getById(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }

      const updatedRisks = project.risks.filter(risk => risk.id !== riskId);
      return await this.update(projectId, { risks: updatedRisks });
    } catch (error) {
      console.error('❌ Erreur suppression risque:', error);
      throw error;
    }
  }

  /**
   * Rechercher des projets par titre
   */
  async searchByTitle(title: string): Promise<Project[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId,
        [Query.search('title', title)]
      );
      
      console.log(`✅ ${response.documents.length} projets trouvés pour "${title}"`);
      return response.documents.map(doc => this.mapFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur recherche projets:', error);
      return [];
    }
  }

  /**
   * Récupérer les projets par statut
   */
  async getByStatus(status: Project['status']): Promise<Project[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId,
        [Query.equal('status', status)]
      );
      
      console.log(`✅ ${response.documents.length} projets avec statut "${status}"`);
      return response.documents.map(doc => this.mapFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération projets par statut:', error);
      return [];
    }
  }

  /**
   * Récupérer les projets par priorité
   */
  async getByPriority(priority: Project['priority']): Promise<Project[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId,
        [Query.equal('priority', priority)]
      );
      
      console.log(`✅ ${response.documents.length} projets avec priorité "${priority}"`);
      return response.documents.map(doc => this.mapFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération projets par priorité:', error);
      return [];
    }
  }

  /**
   * Récupérer les projets d'un client
   */
  async getByClient(client: string): Promise<Project[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId,
        [Query.equal('client', client)]
      );
      
      console.log(`✅ ${response.documents.length} projets pour le client "${client}"`);
      return response.documents.map(doc => this.mapFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération projets par client:', error);
      return [];
    }
  }
}

export const projectService = new ProjectService();

