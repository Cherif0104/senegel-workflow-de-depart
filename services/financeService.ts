/**
 * SERVICE FINANCE - ERP SENEGEL
 * Gestion des factures, dépenses et budgets
 */

import { databases, DATABASE_ID, COLLECTION_IDS } from './appwriteService';
import { ID, Query } from 'appwrite';

// ============================================
// INVOICE SERVICE (Factures)
// ============================================

export const invoiceService = {
  /**
   * Liste toutes les factures
   */
  async list(filters?: { status?: string; clientName?: string; limit?: number }) {
    const queries = [Query.orderDesc('$createdAt')];
    
    if (filters?.status) {
      queries.push(Query.equal('status', filters.status));
    }
    
    if (filters?.clientName) {
      queries.push(Query.search('clientName', filters.clientName));
    }
    
    queries.push(Query.limit(filters?.limit || 100));
    
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.INVOICES,
        queries
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error);
      throw error;
    }
  },

  /**
   * Récupère une facture par ID
   */
  async get(invoiceId: string) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.INVOICES,
        invoiceId
      );
    } catch (error) {
      console.error('Erreur lors de la récupération de la facture:', error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle facture
   */
  async create(invoiceData: any, userId: string) {
    try {
      const invoice = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.INVOICES,
        ID.unique(),
        {
          ...invoiceData,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Facture créée:', invoice.$id);
      return invoice;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la facture:', error);
      throw error;
    }
  },

  /**
   * Met à jour une facture
   */
  async update(invoiceId: string, data: any) {
    try {
      const invoice = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.INVOICES,
        invoiceId,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Facture mise à jour:', invoiceId);
      return invoice;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la facture:', error);
      throw error;
    }
  },

  /**
   * Supprime une facture
   */
  async delete(invoiceId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.INVOICES,
        invoiceId
      );
      
      console.log('✅ Facture supprimée:', invoiceId);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la facture:', error);
      throw error;
    }
  },

  /**
   * Récupère les factures d'un client
   */
  async getByClient(clientName: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.INVOICES,
        [
          Query.equal('clientName', clientName),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des factures du client:', error);
      throw error;
    }
  },

  /**
   * Calcule le total des factures
   */
  async getTotalAmount(status?: string) {
    try {
      const queries = status ? [Query.equal('status', status)] : [];
      queries.push(Query.limit(1000)); // Limite pour éviter trop de données
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.INVOICES,
        queries
      );
      
      const total = response.documents.reduce((sum, doc) => {
        return sum + (parseFloat(doc.amount) || 0);
      }, 0);
      
      return total;
    } catch (error) {
      console.error('Erreur lors du calcul du total:', error);
      return 0;
    }
  },
};

// ============================================
// EXPENSE SERVICE (Dépenses)
// ============================================

export const expenseService = {
  /**
   * Liste toutes les dépenses
   */
  async list(filters?: { category?: string; status?: string; limit?: number }) {
    const queries = [Query.orderDesc('date')];
    
    if (filters?.category) {
      queries.push(Query.equal('category', filters.category));
    }
    
    if (filters?.status) {
      queries.push(Query.equal('status', filters.status));
    }
    
    queries.push(Query.limit(filters?.limit || 100));
    
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.EXPENSES,
        queries
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses:', error);
      throw error;
    }
  },

  /**
   * Récupère une dépense par ID
   */
  async get(expenseId: string) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.EXPENSES,
        expenseId
      );
    } catch (error) {
      console.error('Erreur lors de la récupération de la dépense:', error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle dépense
   */
  async create(expenseData: any, userId: string) {
    try {
      const expense = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.EXPENSES,
        ID.unique(),
        {
          ...expenseData,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Dépense créée:', expense.$id);
      return expense;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la dépense:', error);
      throw error;
    }
  },

  /**
   * Met à jour une dépense
   */
  async update(expenseId: string, data: any) {
    try {
      const expense = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.EXPENSES,
        expenseId,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Dépense mise à jour:', expenseId);
      return expense;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la dépense:', error);
      throw error;
    }
  },

  /**
   * Supprime une dépense
   */
  async delete(expenseId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.EXPENSES,
        expenseId
      );
      
      console.log('✅ Dépense supprimée:', expenseId);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la dépense:', error);
      throw error;
    }
  },

  /**
   * Récupère les dépenses par catégorie
   */
  async getByCategory(category: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.EXPENSES,
        [
          Query.equal('category', category),
          Query.orderDesc('date'),
          Query.limit(100)
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses par catégorie:', error);
      throw error;
    }
  },

  /**
   * Calcule le total des dépenses
   */
  async getTotalAmount(filters?: { category?: string; startDate?: string; endDate?: string }) {
    try {
      const queries: any[] = [];
      
      if (filters?.category) {
        queries.push(Query.equal('category', filters.category));
      }
      
      if (filters?.startDate) {
        queries.push(Query.greaterThanEqual('date', filters.startDate));
      }
      
      if (filters?.endDate) {
        queries.push(Query.lessThanEqual('date', filters.endDate));
      }
      
      queries.push(Query.limit(1000));
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.EXPENSES,
        queries
      );
      
      const total = response.documents.reduce((sum, doc) => {
        return sum + (parseFloat(doc.amount) || 0);
      }, 0);
      
      return total;
    } catch (error) {
      console.error('Erreur lors du calcul du total des dépenses:', error);
      return 0;
    }
  },
};

// ============================================
// BUDGET SERVICE (Budgets)
// ============================================

export const budgetService = {
  /**
   * Liste tous les budgets
   */
  async list(filters?: { type?: string; projectId?: string }) {
    const queries = [Query.orderDesc('$createdAt')];
    
    if (filters?.type) {
      queries.push(Query.equal('type', filters.type));
    }
    
    if (filters?.projectId) {
      queries.push(Query.equal('projectId', filters.projectId));
    }
    
    queries.push(Query.limit(100));
    
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.BUDGETS,
        queries
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des budgets:', error);
      throw error;
    }
  },

  /**
   * Récupère un budget par ID
   */
  async get(budgetId: string) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.BUDGETS,
        budgetId
      );
    } catch (error) {
      console.error('Erreur lors de la récupération du budget:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau budget
   */
  async create(budgetData: any, userId: string) {
    try {
      const budget = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.BUDGETS,
        ID.unique(),
        {
          ...budgetData,
          createdBy: userId,
          spent: 0, // Montant dépensé initial
          remaining: budgetData.amount, // Montant restant initial
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Budget créé:', budget.$id);
      return budget;
    } catch (error) {
      console.error('❌ Erreur lors de la création du budget:', error);
      throw error;
    }
  },

  /**
   * Met à jour un budget
   */
  async update(budgetId: string, data: any) {
    try {
      const budget = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.BUDGETS,
        budgetId,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
      
      console.log('✅ Budget mis à jour:', budgetId);
      return budget;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du budget:', error);
      throw error;
    }
  },

  /**
   * Supprime un budget
   */
  async delete(budgetId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.BUDGETS,
        budgetId
      );
      
      console.log('✅ Budget supprimé:', budgetId);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du budget:', error);
      throw error;
    }
  },

  /**
   * Met à jour le montant dépensé d'un budget
   */
  async updateSpent(budgetId: string, spentAmount: number) {
    try {
      const budget = await this.get(budgetId);
      const totalAmount = parseFloat(budget.amount) || 0;
      const remaining = totalAmount - spentAmount;
      
      return await this.update(budgetId, {
        spent: spentAmount,
        remaining: remaining,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du montant dépensé:', error);
      throw error;
    }
  },

  /**
   * Récupère les budgets d'un projet
   */
  async getByProject(projectId: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.BUDGETS,
        [
          Query.equal('projectId', projectId),
          Query.orderDesc('$createdAt'),
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des budgets du projet:', error);
      throw error;
    }
  },
};

// ============================================
// RECURRING INVOICE SERVICE (Factures récurrentes)
// ============================================

export const recurringInvoiceService = {
  /**
   * Liste toutes les factures récurrentes
   */
  async list() {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.RECURRING_INVOICES,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des factures récurrentes:', error);
      throw error;
    }
  },

  /**
   * Crée une facture récurrente
   */
  async create(data: any, userId: string) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.RECURRING_INVOICES,
        ID.unique(),
        {
          ...data,
          createdBy: userId,
          createdAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Erreur lors de la création de la facture récurrente:', error);
      throw error;
    }
  },

  /**
   * Met à jour une facture récurrente
   */
  async update(id: string, data: any) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.RECURRING_INVOICES,
        id,
        data
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  },

  /**
   * Supprime une facture récurrente
   */
  async delete(id: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.RECURRING_INVOICES,
        id
      );
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  },
};

// ============================================
// RECURRING EXPENSE SERVICE (Dépenses récurrentes)
// ============================================

export const recurringExpenseService = {
  /**
   * Liste toutes les dépenses récurrentes
   */
  async list() {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.RECURRING_EXPENSES,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses récurrentes:', error);
      throw error;
    }
  },

  /**
   * Crée une dépense récurrente
   */
  async create(data: any, userId: string) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.RECURRING_EXPENSES,
        ID.unique(),
        {
          ...data,
          createdBy: userId,
          createdAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Erreur lors de la création de la dépense récurrente:', error);
      throw error;
    }
  },

  /**
   * Met à jour une dépense récurrente
   */
  async update(id: string, data: any) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.RECURRING_EXPENSES,
        id,
        data
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  },

  /**
   * Supprime une dépense récurrente
   */
  async delete(id: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.RECURRING_EXPENSES,
        id
      );
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  },
};

