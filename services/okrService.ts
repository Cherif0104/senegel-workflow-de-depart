import { databases, DATABASE_ID, ID, Query } from './appwriteService';
import { Objective, KeyResult } from '../types';

class OKRService {
  private get objectivesCollectionId() {
    return 'objectives';
  }

  private get keyResultsCollectionId() {
    return 'key_results';
  }

  // ===== OBJECTIVES =====

  private mapObjectiveFromAppwrite(doc: any): Objective {
    return {
      id: doc.$id,
      title: doc.title,
      projectId: doc.projectId,
      keyResults: doc.keyResults || [],
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    };
  }

  private mapObjectiveToAppwrite(objective: Partial<Objective>): any {
    const data: any = {};
    if (objective.title !== undefined) data.title = objective.title;
    if (objective.projectId !== undefined) data.projectId = objective.projectId;
    if (objective.keyResults !== undefined) data.keyResults = objective.keyResults;
    return data;
  }

  async createObjective(objectiveData: Omit<Objective, 'id' | 'createdAt' | 'updatedAt'>): Promise<Objective | null> {
    try {
      // Mode démo : simuler la création avec persistance
      if (this.isDemoMode()) {
        const demoObjective: Objective = {
          ...objectiveData,
          id: `demo-objective-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Charger les objectifs existants et ajouter le nouveau
        const existingObjectives = this.loadDemoObjectives();
        const updatedObjectives = [...existingObjectives, demoObjective];
        this.saveDemoObjectives(updatedObjectives);
        
        console.log('✅ Objectif créé en mode démo et sauvegardé:', demoObjective.id);
        return demoObjective;
      }

      // Mode production : création dans Appwrite
      const appwriteData = this.mapObjectiveToAppwrite(objectiveData);
      const response = await databases.createDocument(
        DATABASE_ID,
        this.objectivesCollectionId,
        ID.unique(),
        appwriteData
      );
      console.log('✅ Objectif créé dans Appwrite:', response.$id);
      return this.mapObjectiveFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur création objectif:', error);
      
      // Mode démo : fallback vers simulation
      if (this.isDemoMode()) {
        const demoObjective: Objective = {
          ...objectiveData,
          id: `demo-objective-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('✅ Objectif créé en mode démo (fallback):', demoObjective.id);
        return demoObjective;
      }
      
      throw error;
    }
  }

  async getObjectives(): Promise<Objective[]> {
    try {
      // Mode démo : retourner des objectifs persistants
      if (this.isDemoMode()) {
        const objectives = this.loadDemoObjectives();
        console.log(`🔄 Mode démo - ${objectives.length} objectifs chargés depuis localStorage`);
        return objectives;
      }

      // Mode production : récupération depuis Appwrite
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.objectivesCollectionId
      );
      console.log(`✅ ${response.documents.length} objectifs récupérés`);
      return response.documents.map(doc => this.mapObjectiveFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération objectifs:', error);
      
      // Mode démo : fallback vers objectifs persistants
      if (this.isDemoMode()) {
        const objectives = this.loadDemoObjectives();
        console.log(`🔄 Mode démo - Fallback vers ${objectives.length} objectifs persistants`);
        return objectives;
      }
      
      return [];
    }
  }

  async getObjectiveById(id: string): Promise<Objective | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        this.objectivesCollectionId,
        id
      );
      console.log('✅ Objectif récupéré:', id);
      return this.mapObjectiveFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur récupération objectif:', error);
      return null;
    }
  }

  async getObjectivesByProject(projectId: string): Promise<Objective[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.objectivesCollectionId,
        [Query.equal('projectId', projectId)]
      );
      console.log(`✅ ${response.documents.length} objectifs récupérés pour projet ${projectId}`);
      return response.documents.map(doc => this.mapObjectiveFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération objectifs par projet:', error);
      return [];
    }
  }

  async updateObjective(id: string, objectiveData: Partial<Objective>): Promise<Objective | null> {
    try {
      // Mode démo : mise à jour avec persistance
      if (this.isDemoMode()) {
        const existingObjectives = this.loadDemoObjectives();
        const objectiveIndex = existingObjectives.findIndex(obj => obj.id === id);
        
        if (objectiveIndex === -1) {
          throw new Error('Objectif non trouvé');
        }
        
        const updatedObjective: Objective = {
          ...existingObjectives[objectiveIndex],
          ...objectiveData,
          id: id, // Conserver l'ID original
          updatedAt: new Date().toISOString()
        };
        
        // Mettre à jour la liste et sauvegarder
        existingObjectives[objectiveIndex] = updatedObjective;
        this.saveDemoObjectives(existingObjectives);
        
        console.log('✅ Objectif mis à jour en mode démo et sauvegardé:', id);
        return updatedObjective;
      }

      // Mode production : mise à jour dans Appwrite
      const appwriteData = this.mapObjectiveToAppwrite(objectiveData);
      const response = await databases.updateDocument(
        DATABASE_ID,
        this.objectivesCollectionId,
        id,
        appwriteData
      );
      console.log('✅ Objectif mis à jour dans Appwrite:', id);
      return this.mapObjectiveFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur mise à jour objectif:', error);
      throw error;
    }
  }

  async deleteObjective(id: string): Promise<boolean> {
    try {
      // Mode démo : suppression avec persistance
      if (this.isDemoMode()) {
        const existingObjectives = this.loadDemoObjectives();
        const filteredObjectives = existingObjectives.filter(obj => obj.id !== id);
        
        if (filteredObjectives.length === existingObjectives.length) {
          throw new Error('Objectif non trouvé');
        }
        
        this.saveDemoObjectives(filteredObjectives);
        console.log('✅ Objectif supprimé en mode démo et sauvegardé:', id);
        return true;
      }

      // Mode production : suppression dans Appwrite
      await databases.deleteDocument(
        DATABASE_ID,
        this.objectivesCollectionId,
        id
      );
      console.log('✅ Objectif supprimé de Appwrite:', id);
      return true;
    } catch (error) {
      console.error('❌ Erreur suppression objectif:', error);
      return false;
    }
  }

  // ===== KEY RESULTS =====

  private mapKeyResultFromAppwrite(doc: any): KeyResult {
    return {
      id: doc.$id,
      title: doc.title,
      target: doc.target,
      current: doc.current,
      unit: doc.unit,
      objectiveId: doc.objectiveId,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    };
  }

  private mapKeyResultToAppwrite(keyResult: Partial<KeyResult>): any {
    const data: any = {};
    if (keyResult.title !== undefined) data.title = keyResult.title;
    if (keyResult.target !== undefined) data.target = keyResult.target;
    if (keyResult.current !== undefined) data.current = keyResult.current;
    if (keyResult.unit !== undefined) data.unit = keyResult.unit;
    if (keyResult.objectiveId !== undefined) data.objectiveId = keyResult.objectiveId;
    return data;
  }

  async createKeyResult(keyResultData: Omit<KeyResult, 'id' | 'createdAt' | 'updatedAt'>): Promise<KeyResult | null> {
    try {
      // Mode démo : simuler la création
      if (this.isDemoMode()) {
        const demoKeyResult: KeyResult = {
          ...keyResultData,
          id: `demo-kr-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        console.log('✅ Key Result créé en mode démo:', demoKeyResult.id);
        return demoKeyResult;
      }

      // Mode production : création dans Appwrite
      const appwriteData = this.mapKeyResultToAppwrite(keyResultData);
      const response = await databases.createDocument(
        DATABASE_ID,
        this.keyResultsCollectionId,
        ID.unique(),
        appwriteData
      );
      console.log('✅ Key Result créé dans Appwrite:', response.$id);
      return this.mapKeyResultFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur création key result:', error);
      
      // Mode démo : fallback vers simulation
      if (this.isDemoMode()) {
        const demoKeyResult: KeyResult = {
          ...keyResultData,
          id: `demo-kr-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        console.log('✅ Key Result créé en mode démo (fallback):', demoKeyResult.id);
        return demoKeyResult;
      }
      
      throw error;
    }
  }

  async getKeyResults(): Promise<KeyResult[]> {
    try {
      // Mode démo : retourner des key results persistants
      if (this.isDemoMode()) {
        const keyResults = this.loadDemoKeyResults();
        console.log(`🔄 Mode démo - ${keyResults.length} key results chargés depuis localStorage`);
        return keyResults;
      }

      // Mode production : récupération depuis Appwrite
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.keyResultsCollectionId
      );
      console.log(`✅ ${response.documents.length} key results récupérés`);
      return response.documents.map(doc => this.mapKeyResultFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération key results:', error);
      
      // Mode démo : fallback vers key results persistants
      if (this.isDemoMode()) {
        const keyResults = this.loadDemoKeyResults();
        console.log(`🔄 Mode démo - Fallback vers ${keyResults.length} key results persistants`);
        return keyResults;
      }
      
      return [];
    }
  }

  async getKeyResultsByObjective(objectiveId: string): Promise<KeyResult[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.keyResultsCollectionId,
        [Query.equal('objectiveId', objectiveId)]
      );
      console.log(`✅ ${response.documents.length} key results récupérés pour objectif ${objectiveId}`);
      return response.documents.map(doc => this.mapKeyResultFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération key results par objectif:', error);
      return [];
    }
  }

  async updateKeyResult(id: string, keyResultData: Partial<KeyResult>): Promise<KeyResult | null> {
    try {
      const appwriteData = this.mapKeyResultToAppwrite(keyResultData);
      const response = await databases.updateDocument(
        DATABASE_ID,
        this.keyResultsCollectionId,
        id,
        appwriteData
      );
      console.log('✅ Key Result mis à jour dans Appwrite:', id);
      return this.mapKeyResultFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur mise à jour key result:', error);
      throw error;
    }
  }

  async deleteKeyResult(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        this.keyResultsCollectionId,
        id
      );
      console.log('✅ Key Result supprimé de Appwrite:', id);
      return true;
    } catch (error) {
      console.error('❌ Erreur suppression key result:', error);
      return false;
    }
  }

  // ===== ANALYTICS =====

  async getOKRAnalytics(): Promise<any> {
    try {
      const [objectives, keyResults] = await Promise.all([
        this.getObjectives(),
        this.getKeyResults()
      ]);

      const totalObjectives = objectives.length;
      const totalKeyResults = keyResults.length;
      
      const completedObjectives = objectives.filter(obj => 
        obj.keyResults.every(kr => kr.current >= kr.target)
      ).length;

      const averageProgress = keyResults.length > 0 
        ? keyResults.reduce((sum, kr) => sum + (kr.current / kr.target), 0) / keyResults.length * 100
        : 0;

      const objectivesByProject = objectives.reduce((acc, obj) => {
        acc[obj.projectId] = (acc[obj.projectId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalObjectives,
        totalKeyResults,
        completedObjectives,
        completionRate: totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0,
        averageProgress,
        objectivesByProject,
      };
    } catch (error) {
      console.error('❌ Erreur calcul analytics OKR:', error);
      throw error;
    }
  }

  // ===== BULK OPERATIONS =====

  async createObjectiveWithKeyResults(objectiveData: Omit<Objective, 'id' | 'createdAt' | 'updatedAt'>): Promise<Objective | null> {
    try {
      // Mode démo : créer directement l'objectif avec key results
      if (this.isDemoMode()) {
        const demoObjective: Objective = {
          ...objectiveData,
          id: `demo-objective-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          keyResults: objectiveData.keyResults.map(kr => ({
            ...kr,
            id: `demo-kr-${Date.now()}-${Math.random()}`,
            objectiveId: `demo-objective-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))
        };
        
        // Charger les objectifs existants et ajouter le nouveau
        const existingObjectives = this.loadDemoObjectives();
        const updatedObjectives = [...existingObjectives, demoObjective];
        this.saveDemoObjectives(updatedObjectives);
        
        console.log('✅ Objectif avec key results créé en mode démo:', demoObjective.id);
        return demoObjective;
      }

      // Mode production : créer l'objectif puis les key results
      const objective = await this.createObjective(objectiveData);
      if (!objective) return null;

      // Créer les key results
      const keyResults = await Promise.all(
        objectiveData.keyResults.map(kr => 
          this.createKeyResult({
            ...kr,
            objectiveId: objective.id
          })
        )
      );

      // Mettre à jour l'objectif avec les key results créés
      const updatedObjective = await this.updateObjective(objective.id, {
        keyResults: keyResults.filter(kr => kr !== null) as KeyResult[]
      });

      console.log('✅ Objectif avec key results créé:', objective.id);
      return updatedObjective;
    } catch (error) {
      console.error('❌ Erreur création objectif avec key results:', error);
      throw error;
    }
  }

  async updateObjectiveWithKeyResults(objectiveId: string, objectiveData: Partial<Objective>): Promise<Objective | null> {
    try {
      // Mode démo : mise à jour avec persistance
      if (this.isDemoMode()) {
        const existingObjectives = this.loadDemoObjectives();
        const objectiveIndex = existingObjectives.findIndex(obj => obj.id === objectiveId);
        
        if (objectiveIndex === -1) {
          throw new Error('Objectif non trouvé');
        }
        
        const updatedObjective: Objective = {
          ...existingObjectives[objectiveIndex],
          ...objectiveData,
          id: objectiveId, // Conserver l'ID original
          updatedAt: new Date().toISOString()
        };
        
        // Mettre à jour la liste et sauvegarder
        existingObjectives[objectiveIndex] = updatedObjective;
        this.saveDemoObjectives(existingObjectives);
        
        console.log('✅ Objectif avec key results mis à jour en mode démo et sauvegardé:', objectiveId);
        return updatedObjective;
      }

      // Mode production : mise à jour dans Appwrite
      const objective = await this.updateObjective(objectiveId, objectiveData);
      if (!objective) return null;

      // Si des key results sont fournis, les mettre à jour
      if (objectiveData.keyResults) {
        // Supprimer les anciens key results
        const existingKeyResults = await this.getKeyResultsByObjective(objectiveId);
        await Promise.all(
          existingKeyResults.map(kr => this.deleteKeyResult(kr.id))
        );

        // Créer les nouveaux key results
        await Promise.all(
          objectiveData.keyResults.map(kr => 
            this.createKeyResult({
              ...kr,
              objectiveId: objectiveId
            })
          )
        );
      }

      console.log('✅ Objectif avec key results mis à jour:', objectiveId);
      return objective;
    } catch (error) {
      console.error('❌ Erreur mise à jour objectif avec key results:', error);
      throw error;
    }
  }

  // ===== MÉTHODES DE PERSISTANCE MODE DÉMO =====

  private isDemoMode(): boolean {
    const user = JSON.parse(localStorage.getItem('ecosystia_user') || '{}');
    return user.id && user.id.startsWith('demo-user-');
  }

  private saveDemoObjectives(objectives: Objective[]): void {
    localStorage.setItem('ecosystia_demo_objectives', JSON.stringify(objectives));
  }

  private loadDemoObjectives(): Objective[] {
    const saved = localStorage.getItem('ecosystia_demo_objectives');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('❌ Erreur chargement objectifs démo:', error);
      }
    }
    return this.getDemoObjectives();
  }

  private saveDemoKeyResults(keyResults: KeyResult[]): void {
    localStorage.setItem('ecosystia_demo_key_results', JSON.stringify(keyResults));
  }

  private loadDemoKeyResults(): KeyResult[] {
    const saved = localStorage.getItem('ecosystia_demo_key_results');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('❌ Erreur chargement key results démo:', error);
      }
    }
    return this.getDemoKeyResults();
  }

  private getDemoKeyResults(): KeyResult[] {
    return [
      {
        id: 'demo-kr-1',
        title: 'Augmenter le score NPS à 8',
        target: 8,
        current: 6,
        unit: 'points',
        objectiveId: 'demo-objective-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'demo-kr-2',
        title: 'Réduire le temps de réponse à 2h',
        target: 2,
        current: 4,
        unit: 'heures',
        objectiveId: 'demo-objective-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'demo-kr-3',
        title: 'Réduire le temps de chargement à 2s',
        target: 2,
        current: 3,
        unit: 'secondes',
        objectiveId: 'demo-objective-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  private getDemoObjectives(): Objective[] {
    return [
      {
        id: 'demo-objective-1',
        title: 'Améliorer la satisfaction client',
        projectId: 'demo-project-1',
        keyResults: [
          {
            id: 'demo-kr-1',
            title: 'Augmenter le score NPS à 8',
            target: 8,
            current: 6,
            unit: 'points',
            objectiveId: 'demo-objective-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'demo-kr-2',
            title: 'Réduire le temps de réponse à 2h',
            target: 2,
            current: 4,
            unit: 'heures',
            objectiveId: 'demo-objective-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'demo-objective-2',
        title: 'Optimiser les performances du site',
        projectId: 'demo-project-1',
        keyResults: [
          {
            id: 'demo-kr-3',
            title: 'Réduire le temps de chargement à 2s',
            target: 2,
            current: 3,
            unit: 'secondes',
            objectiveId: 'demo-objective-2',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
}

export const okrService = new OKRService();
