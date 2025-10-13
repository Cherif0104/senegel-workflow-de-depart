/**
 * SERVICE CRM - ERP SENEGEL
 * Gestion des clients, leads et contacts
 */

import { databases, DATABASE_ID, COLLECTION_IDS } from './appwriteService';
import { ID, Query } from 'appwrite';

// ============================================
// CLIENT SERVICE (Clients CRM)
// ============================================

export const clientService = {
  /**
   * Liste tous les clients
   */
  async list(filters?: { status?: string; assignedTo?: string; limit?: number }) {
    const queries = [Query.orderDesc('$createdAt')];
    
    if (filters?.status) {
      queries.push(Query.equal('status', filters.status));
    }
    
    if (filters?.assignedTo) {
      queries.push(Query.equal('assignedTo', filters.assignedTo));
    }
    
    queries.push(Query.limit(filters?.limit || 100));
    
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        queries
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }
  },

  /**
   * Récupère un client par ID
   */
  async get(clientId: string) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        clientId
      );
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau client
   */
  async create(clientData: any, userId: string) {
    try {
      const client = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        ID.unique(),
        {
          ...clientData,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Client créé:', client.$id);
      return client;
    } catch (error) {
      console.error('❌ Erreur lors de la création du client:', error);
      throw error;
    }
  },

  /**
   * Met à jour un client
   */
  async update(clientId: string, data: any) {
    try {
      const client = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        clientId,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Client mis à jour:', clientId);
      return client;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du client:', error);
      throw error;
    }
  },

  /**
   * Supprime un client
   */
  async delete(clientId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        clientId
      );
      
      console.log('✅ Client supprimé:', clientId);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du client:', error);
      throw error;
    }
  },

  /**
   * Recherche des clients
   */
  async search(searchTerm: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        [
          Query.search('name', searchTerm),
          Query.limit(50)
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la recherche de clients:', error);
      throw error;
    }
  },

  /**
   * Récupère les clients assignés à un utilisateur
   */
  async getByAssignee(userId: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        [
          Query.equal('assignedTo', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des clients assignés:', error);
      throw error;
    }
  },

  /**
   * Calcule le revenu total des clients
   */
  async getTotalRevenue(status?: string) {
    try {
      const queries = status ? [Query.equal('status', status)] : [];
      queries.push(Query.limit(1000));
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        queries
      );
      
      const total = response.documents.reduce((sum, doc) => {
        return sum + (parseFloat(doc.revenue) || 0);
      }, 0);
      
      return total;
    } catch (error) {
      console.error('Erreur lors du calcul du revenu total:', error);
      return 0;
    }
  },
};

// ============================================
// LEAD SERVICE (Leads/Prospects)
// ============================================

export const leadService = {
  /**
   * Liste tous les leads
   */
  async list(filters?: { status?: string; source?: string; limit?: number }) {
    const queries = [Query.orderDesc('$createdAt')];
    
    if (filters?.status) {
      queries.push(Query.equal('status', filters.status));
    }
    
    if (filters?.source) {
      queries.push(Query.equal('source', filters.source));
    }
    
    queries.push(Query.limit(filters?.limit || 100));
    
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS, // Utilise la même collection pour le moment
        queries
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des leads:', error);
      throw error;
    }
  },

  /**
   * Récupère un lead par ID
   */
  async get(leadId: string) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        leadId
      );
    } catch (error) {
      console.error('Erreur lors de la récupération du lead:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau lead
   */
  async create(leadData: any, userId: string) {
    try {
      const lead = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        ID.unique(),
        {
          ...leadData,
          type: 'lead', // Distinguer lead vs client
          score: leadData.score || 0,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Lead créé:', lead.$id);
      return lead;
    } catch (error) {
      console.error('❌ Erreur lors de la création du lead:', error);
      throw error;
    }
  },

  /**
   * Met à jour un lead
   */
  async update(leadId: string, data: any) {
    try {
      const lead = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        leadId,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Lead mis à jour:', leadId);
      return lead;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du lead:', error);
      throw error;
    }
  },

  /**
   * Supprime un lead
   */
  async delete(leadId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        leadId
      );
      
      console.log('✅ Lead supprimé:', leadId);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du lead:', error);
      throw error;
    }
  },

  /**
   * Convertit un lead en client
   */
  async convertToClient(leadId: string) {
    try {
      const lead = await this.get(leadId);
      
      // Met à jour le type de "lead" à "client"
      return await this.update(leadId, {
        type: 'client',
        status: 'Active',
        convertedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Erreur lors de la conversion du lead:', error);
      throw error;
    }
  },

  /**
   * Met à jour le score d'un lead
   */
  async updateScore(leadId: string, score: number) {
    try {
      return await this.update(leadId, { score });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du score:', error);
      throw error;
    }
  },

  /**
   * Récupère les leads par statut (pipeline)
   */
  async getByStatus(status: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        [
          Query.equal('type', 'lead'),
          Query.equal('status', status),
          Query.orderDesc('score'), // Trié par score décroissant
          Query.limit(100)
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des leads par statut:', error);
      throw error;
    }
  },

  /**
   * Récupère les leads à fort potentiel (score élevé)
   */
  async getHighPotential(minScore: number = 70) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CRM_CLIENTS,
        [
          Query.equal('type', 'lead'),
          Query.greaterThanEqual('score', minScore),
          Query.orderDesc('score'),
          Query.limit(50)
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des leads à fort potentiel:', error);
      throw error;
    }
  },
};

// ============================================
// CONTACT SERVICE (Contacts CRM - Déjà existant, mais amélioré)
// ============================================

export const contactService = {
  /**
   * Liste tous les contacts
   */
  async list(filters?: { tags?: string[]; limit?: number }) {
    const queries = [Query.orderDesc('$createdAt')];
    
    if (filters?.tags && filters.tags.length > 0) {
      // Note: Appwrite ne supporte pas nativement le filtrage par tableau
      // Il faudrait une approche différente pour les tags
    }
    
    queries.push(Query.limit(filters?.limit || 100));
    
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CONTACTS,
        queries
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
      throw error;
    }
  },

  /**
   * Récupère un contact par ID
   */
  async get(contactId: string) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.CONTACTS,
        contactId
      );
    } catch (error) {
      console.error('Erreur lors de la récupération du contact:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau contact
   */
  async create(contactData: any, userId: string) {
    try {
      const contact = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.CONTACTS,
        ID.unique(),
        {
          ...contactData,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Contact créé:', contact.$id);
      return contact;
    } catch (error) {
      console.error('❌ Erreur lors de la création du contact:', error);
      throw error;
    }
  },

  /**
   * Met à jour un contact
   */
  async update(contactId: string, data: any) {
    try {
      const contact = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.CONTACTS,
        contactId,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Contact mis à jour:', contactId);
      return contact;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du contact:', error);
      throw error;
    }
  },

  /**
   * Supprime un contact
   */
  async delete(contactId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.CONTACTS,
        contactId
      );
      
      console.log('✅ Contact supprimé:', contactId);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du contact:', error);
      throw error;
    }
  },

  /**
   * Recherche des contacts
   */
  async search(searchTerm: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CONTACTS,
        [
          Query.search('name', searchTerm),
          Query.limit(50)
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la recherche de contacts:', error);
      throw error;
    }
  },

  /**
   * Récupère les contacts par entreprise
   */
  async getByCompany(companyName: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CONTACTS,
        [
          Query.equal('company', companyName),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts par entreprise:', error);
      throw error;
    }
  },
};

