/**
 * 📁 SERVICE PROJECTS - ECOSYSTIA
 * Gestion complète des projets avec Appwrite
 */

import { databases, DATABASE_ID, COLLECTION_IDS, ID, Query } from './appwriteService';
import { Project, Task, Risk, User } from '../types';

class ProjectService {
  private collectionId = COLLECTION_IDS.PROJECTS;

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
      throw error;
    }
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
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId
      );
      
      console.log(`✅ ${response.documents.length} projets récupérés`);
      return response.documents.map(doc => this.mapFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération tous les projets:', error);
      return [];
    }
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

