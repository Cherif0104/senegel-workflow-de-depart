import { databases, DATABASE_ID, ID, Query } from './appwriteService';
import { Invoice, Expense, Budget, RecurringInvoice, RecurringExpense, BudgetItem, FinancialMetrics } from '../types';

class FinanceService {
  private get invoicesCollectionId() {
    return 'invoices';
  }

  private get expensesCollectionId() {
    return 'expenses';
  }

  private get budgetsCollectionId() {
    return 'budgets';
  }

  private get recurringInvoicesCollectionId() {
    return 'recurring_invoices';
  }

  private get recurringExpensesCollectionId() {
    return 'recurring_expenses';
  }

  private get budgetItemsCollectionId() {
    return 'budget_items';
  }

  // ===== INVOICES =====

  private mapInvoiceFromAppwrite(doc: any): Invoice {
    return {
      id: doc.$id,
      invoiceNumber: doc.invoiceNumber,
      clientName: doc.clientName,
      amount: doc.amount,
      dueDate: doc.dueDate,
      status: doc.status,
      paidAmount: doc.paidAmount,
      paidDate: doc.paidDate,
      receipt: doc.receipt,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    };
  }

  private mapInvoiceToAppwrite(invoice: Partial<Invoice>): any {
    const data: any = {};
    if (invoice.invoiceNumber !== undefined) data.invoiceNumber = invoice.invoiceNumber;
    if (invoice.clientName !== undefined) data.clientName = invoice.clientName;
    if (invoice.amount !== undefined) data.amount = invoice.amount;
    if (invoice.dueDate !== undefined) data.dueDate = invoice.dueDate;
    if (invoice.status !== undefined) data.status = invoice.status;
    if (invoice.paidAmount !== undefined) data.paidAmount = invoice.paidAmount;
    if (invoice.paidDate !== undefined) data.paidDate = invoice.paidDate;
    if (invoice.receipt !== undefined) data.receipt = invoice.receipt;
    return data;
  }

  async createInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice | null> {
    try {
      const appwriteData = this.mapInvoiceToAppwrite(invoiceData);
      const response = await databases.createDocument(
        DATABASE_ID,
        this.invoicesCollectionId,
        ID.unique(),
        appwriteData
      );
      console.log('✅ Facture créée dans Appwrite:', response.$id);
      return this.mapInvoiceFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur création facture:', error);
      throw error;
    }
  }

  async getInvoices(): Promise<Invoice[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.invoicesCollectionId
      );
      console.log(`✅ ${response.documents.length} factures récupérées`);
      return response.documents.map(doc => this.mapInvoiceFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération factures:', error);
      return [];
    }
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        this.invoicesCollectionId,
        id
      );
      console.log('✅ Facture récupérée:', id);
      return this.mapInvoiceFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur récupération facture:', error);
      return null;
    }
  }

  async updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<Invoice | null> {
    try {
      const appwriteData = this.mapInvoiceToAppwrite(invoiceData);
      const response = await databases.updateDocument(
        DATABASE_ID,
        this.invoicesCollectionId,
        id,
        appwriteData
      );
      console.log('✅ Facture mise à jour dans Appwrite:', id);
      return this.mapInvoiceFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur mise à jour facture:', error);
      throw error;
    }
  }

  async deleteInvoice(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        this.invoicesCollectionId,
        id
      );
      console.log('✅ Facture supprimée de Appwrite:', id);
      return true;
    } catch (error) {
      console.error('❌ Erreur suppression facture:', error);
      return false;
    }
  }

  // ===== EXPENSES =====

  private mapExpenseFromAppwrite(doc: any): Expense {
    return {
      id: doc.$id,
      category: doc.category,
      description: doc.description,
      amount: doc.amount,
      date: doc.date,
      dueDate: doc.dueDate,
      status: doc.status,
      budgetItemId: doc.budgetItemId,
      receipt: doc.receipt,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    };
  }

  private mapExpenseToAppwrite(expense: Partial<Expense>): any {
    const data: any = {};
    if (expense.category !== undefined) data.category = expense.category;
    if (expense.description !== undefined) data.description = expense.description;
    if (expense.amount !== undefined) data.amount = expense.amount;
    if (expense.date !== undefined) data.date = expense.date;
    if (expense.dueDate !== undefined) data.dueDate = expense.dueDate;
    if (expense.status !== undefined) data.status = expense.status;
    if (expense.budgetItemId !== undefined) data.budgetItemId = expense.budgetItemId;
    if (expense.receipt !== undefined) data.receipt = expense.receipt;
    return data;
  }

  async createExpense(expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense | null> {
    try {
      const appwriteData = this.mapExpenseToAppwrite(expenseData);
      const response = await databases.createDocument(
        DATABASE_ID,
        this.expensesCollectionId,
        ID.unique(),
        appwriteData
      );
      console.log('✅ Dépense créée dans Appwrite:', response.$id);
      return this.mapExpenseFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur création dépense:', error);
      throw error;
    }
  }

  async getExpenses(): Promise<Expense[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.expensesCollectionId
      );
      console.log(`✅ ${response.documents.length} dépenses récupérées`);
      return response.documents.map(doc => this.mapExpenseFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération dépenses:', error);
      return [];
    }
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        this.expensesCollectionId,
        id
      );
      console.log('✅ Dépense récupérée:', id);
      return this.mapExpenseFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur récupération dépense:', error);
      return null;
    }
  }

  async updateExpense(id: string, expenseData: Partial<Expense>): Promise<Expense | null> {
    try {
      const appwriteData = this.mapExpenseToAppwrite(expenseData);
      const response = await databases.updateDocument(
        DATABASE_ID,
        this.expensesCollectionId,
        id,
        appwriteData
      );
      console.log('✅ Dépense mise à jour dans Appwrite:', id);
      return this.mapExpenseFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur mise à jour dépense:', error);
      throw error;
    }
  }

  async deleteExpense(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        this.expensesCollectionId,
        id
      );
      console.log('✅ Dépense supprimée de Appwrite:', id);
      return true;
    } catch (error) {
      console.error('❌ Erreur suppression dépense:', error);
      return false;
    }
  }

  // ===== BUDGETS =====

  private mapBudgetFromAppwrite(doc: any): Budget {
    return {
      id: doc.$id,
      name: doc.name,
      type: doc.type,
      totalAmount: doc.totalAmount,
      spentAmount: doc.spentAmount || 0,
      startDate: doc.startDate,
      endDate: doc.endDate,
      items: doc.items || [],
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    };
  }

  private mapBudgetToAppwrite(budget: Partial<Budget>): any {
    const data: any = {};
    if (budget.name !== undefined) data.name = budget.name;
    if (budget.type !== undefined) data.type = budget.type;
    if (budget.totalAmount !== undefined) data.totalAmount = budget.totalAmount;
    if (budget.spentAmount !== undefined) data.spentAmount = budget.spentAmount;
    if (budget.startDate !== undefined) data.startDate = budget.startDate;
    if (budget.endDate !== undefined) data.endDate = budget.endDate;
    if (budget.items !== undefined) data.items = budget.items;
    return data;
  }

  async createBudget(budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget | null> {
    try {
      const appwriteData = this.mapBudgetToAppwrite(budgetData);
      const response = await databases.createDocument(
        DATABASE_ID,
        this.budgetsCollectionId,
        ID.unique(),
        appwriteData
      );
      console.log('✅ Budget créé dans Appwrite:', response.$id);
      return this.mapBudgetFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur création budget:', error);
      throw error;
    }
  }

  async getBudgets(): Promise<Budget[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.budgetsCollectionId
      );
      console.log(`✅ ${response.documents.length} budgets récupérés`);
      return response.documents.map(doc => this.mapBudgetFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération budgets:', error);
      return [];
    }
  }

  async updateBudget(id: string, budgetData: Partial<Budget>): Promise<Budget | null> {
    try {
      const appwriteData = this.mapBudgetToAppwrite(budgetData);
      const response = await databases.updateDocument(
        DATABASE_ID,
        this.budgetsCollectionId,
        id,
        appwriteData
      );
      console.log('✅ Budget mis à jour dans Appwrite:', id);
      return this.mapBudgetFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur mise à jour budget:', error);
      throw error;
    }
  }

  async deleteBudget(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        this.budgetsCollectionId,
        id
      );
      console.log('✅ Budget supprimé de Appwrite:', id);
      return true;
    } catch (error) {
      console.error('❌ Erreur suppression budget:', error);
      return false;
    }
  }

  // ===== RECURRING INVOICES =====

  async createRecurringInvoice(data: Omit<RecurringInvoice, 'id'>): Promise<RecurringInvoice | null> {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        this.recurringInvoicesCollectionId,
        ID.unique(),
        data
      );
      console.log('✅ Facture récurrente créée dans Appwrite:', response.$id);
      return { ...data, id: response.$id };
    } catch (error) {
      console.error('❌ Erreur création facture récurrente:', error);
      throw error;
    }
  }

  async getRecurringInvoices(): Promise<RecurringInvoice[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.recurringInvoicesCollectionId
      );
      console.log(`✅ ${response.documents.length} factures récurrentes récupérées`);
      return response.documents.map(doc => ({ ...doc, id: doc.$id }));
    } catch (error) {
      console.error('❌ Erreur récupération factures récurrentes:', error);
      return [];
    }
  }

  // ===== RECURRING EXPENSES =====

  async createRecurringExpense(data: Omit<RecurringExpense, 'id'>): Promise<RecurringExpense | null> {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        this.recurringExpensesCollectionId,
        ID.unique(),
        data
      );
      console.log('✅ Dépense récurrente créée dans Appwrite:', response.$id);
      return { ...data, id: response.$id };
    } catch (error) {
      console.error('❌ Erreur création dépense récurrente:', error);
      throw error;
    }
  }

  async getRecurringExpenses(): Promise<RecurringExpense[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.recurringExpensesCollectionId
      );
      console.log(`✅ ${response.documents.length} dépenses récurrentes récupérées`);
      return response.documents.map(doc => ({ ...doc, id: doc.$id }));
    } catch (error) {
      console.error('❌ Erreur récupération dépenses récurrentes:', error);
      return [];
    }
  }

  // ===== FINANCIAL METRICS =====

  async getFinancialMetrics(): Promise<FinancialMetrics> {
    try {
      const [invoices, expenses] = await Promise.all([
        this.getInvoices(),
        this.getExpenses()
      ]);

      const totalRevenue = invoices
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

      const totalExpenses = expenses
        .filter(exp => exp.status === 'Paid')
        .reduce((sum, exp) => sum + exp.amount, 0);

      const outstandingInvoices = invoices
        .filter(inv => ['Sent', 'Overdue', 'Partially Paid'].includes(inv.status))
        .reduce((sum, inv) => {
          if (inv.status === 'Partially Paid') {
            return sum + (inv.amount - (inv.paidAmount || 0));
          }
          return sum + inv.amount;
        }, 0);

      const netIncome = totalRevenue - totalExpenses;

      return {
        totalRevenue,
        totalExpenses,
        netIncome,
        outstandingInvoices,
        paidInvoices: invoices.filter(inv => inv.status === 'Paid').length,
        totalInvoices: invoices.length,
        paidExpenses: expenses.filter(exp => exp.status === 'Paid').length,
        totalExpensesCount: expenses.length,
      };
    } catch (error) {
      console.error('❌ Erreur calcul métriques financières:', error);
      throw error;
    }
  }

  // ===== REPORTS =====

  async getRevenueReport(period: string): Promise<any> {
    try {
      const invoices = await this.getInvoices();
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days
      }

      const filteredInvoices = invoices.filter(inv => {
        const invoiceDate = new Date(inv.createdAt);
        return invoiceDate >= startDate;
      });

      return {
        period,
        totalRevenue: filteredInvoices
          .filter(inv => inv.status === 'Paid')
          .reduce((sum, inv) => sum + inv.amount, 0),
        totalInvoices: filteredInvoices.length,
        paidInvoices: filteredInvoices.filter(inv => inv.status === 'Paid').length,
        invoices: filteredInvoices,
      };
    } catch (error) {
      console.error('❌ Erreur génération rapport revenus:', error);
      throw error;
    }
  }

  async getExpenseReport(period: string): Promise<any> {
    try {
      const expenses = await this.getExpenses();
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days
      }

      const filteredExpenses = expenses.filter(exp => {
        const expenseDate = new Date(exp.date);
        return expenseDate >= startDate;
      });

      return {
        period,
        totalExpenses: filteredExpenses
          .filter(exp => exp.status === 'Paid')
          .reduce((sum, exp) => sum + exp.amount, 0),
        totalExpensesCount: filteredExpenses.length,
        paidExpenses: filteredExpenses.filter(exp => exp.status === 'Paid').length,
        expenses: filteredExpenses,
      };
    } catch (error) {
      console.error('❌ Erreur génération rapport dépenses:', error);
      throw error;
    }
  }
}

export const financeService = new FinanceService();