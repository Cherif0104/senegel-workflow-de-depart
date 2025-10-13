/**
 * 🔒 VALIDATION COMPLÈTE - ECOSYSTIA
 * Système de validation robuste pour toutes les données
 */

import { Project, Task, User, Course, Invoice, Expense, LeaveRequest } from '../types';
import { EcosystiaError, ERROR_CODES } from './errorHandling';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidation {
  field: string;
  error: string;
}

/**
 * Validateurs de base
 */
export const Validators = {
  /**
   * Vérifie qu'une chaîne n'est pas vide
   */
  required: (value: any, fieldName: string): string | null => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} est requis`;
    }
    return null;
  },

  /**
   * Vérifie la longueur minimale
   */
  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (value && value.length < min) {
      return `${fieldName} doit contenir au moins ${min} caractères`;
    }
    return null;
  },

  /**
   * Vérifie la longueur maximale
   */
  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (value && value.length > max) {
      return `${fieldName} ne peut pas dépasser ${max} caractères`;
    }
    return null;
  },

  /**
   * Vérifie le format email
   */
  email: (value: string, fieldName: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return `${fieldName} doit être un email valide`;
    }
    return null;
  },

  /**
   * Vérifie qu'une date est dans le futur
   */
  futureDate: (value: string, fieldName: string): string | null => {
    if (value) {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        return `${fieldName} doit être dans le futur`;
      }
    }
    return null;
  },

  /**
   * Vérifie qu'une date est valide
   */
  validDate: (value: string, fieldName: string): string | null => {
    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return `${fieldName} n'est pas une date valide`;
      }
    }
    return null;
  },

  /**
   * Vérifie qu'un nombre est positif
   */
  positive: (value: number, fieldName: string): string | null => {
    if (value !== undefined && value < 0) {
      return `${fieldName} doit être positif`;
    }
    return null;
  },

  /**
   * Vérifie qu'une valeur est dans une liste
   */
  inList: (value: any, list: any[], fieldName: string): string | null => {
    if (value && !list.includes(value)) {
      return `${fieldName} doit être l'une des valeurs suivantes: ${list.join(', ')}`;
    }
    return null;
  },
};

/**
 * Validation des Projets
 */
export const validateProject = (project: Partial<Project>): ValidationResult => {
  const errors: string[] = [];

  // Titre
  const titleError = Validators.required(project.title, 'Titre');
  if (titleError) errors.push(titleError);
  else {
    const minLengthError = Validators.minLength(project.title!, 3, 'Titre');
    if (minLengthError) errors.push(minLengthError);
    
    const maxLengthError = Validators.maxLength(project.title!, 100, 'Titre');
    if (maxLengthError) errors.push(maxLengthError);
  }

  // Description
  const descriptionError = Validators.required(project.description, 'Description');
  if (descriptionError) errors.push(descriptionError);
  else {
    const maxLengthError = Validators.maxLength(project.description!, 2000, 'Description');
    if (maxLengthError) errors.push(maxLengthError);
  }

  // Statut
  const statusError = Validators.required(project.status, 'Statut');
  if (statusError) errors.push(statusError);
  else {
    const validStatuses = ['Not Started', 'In Progress', 'Completed'];
    const statusListError = Validators.inList(project.status, validStatuses, 'Statut');
    if (statusListError) errors.push(statusListError);
  }

  // Date d'échéance
  const dueDateError = Validators.required(project.dueDate, 'Date d\'échéance');
  if (dueDateError) errors.push(dueDateError);
  else {
    const validDateError = Validators.validDate(project.dueDate!, 'Date d\'échéance');
    if (validDateError) errors.push(validDateError);
    
    const futureDateError = Validators.futureDate(project.dueDate!, 'Date d\'échéance');
    if (futureDateError) errors.push(futureDateError);
  }

  // Équipe
  if (!project.team || project.team.length === 0) {
    errors.push('Au moins un membre d\'équipe est requis');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validation des Tâches
 */
export const validateTask = (task: Partial<Task>): ValidationResult => {
  const errors: string[] = [];

  // Texte
  const textError = Validators.required(task.text, 'Description de la tâche');
  if (textError) errors.push(textError);
  else {
    const minLengthError = Validators.minLength(task.text!, 3, 'Description');
    if (minLengthError) errors.push(minLengthError);
  }

  // Statut
  if (task.status) {
    const validStatuses = ['To Do', 'In Progress', 'Done'];
    const statusError = Validators.inList(task.status, validStatuses, 'Statut');
    if (statusError) errors.push(statusError);
  }

  // Priorité
  if (task.priority) {
    const validPriorities = ['Low', 'Medium', 'High'];
    const priorityError = Validators.inList(task.priority, validPriorities, 'Priorité');
    if (priorityError) errors.push(priorityError);
  }

  // Temps estimé
  if (task.estimatedTime !== undefined) {
    const positiveError = Validators.positive(task.estimatedTime, 'Temps estimé');
    if (positiveError) errors.push(positiveError);
  }

  // Date d'échéance
  if (task.dueDate) {
    const validDateError = Validators.validDate(task.dueDate, 'Date d\'échéance');
    if (validDateError) errors.push(validDateError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validation des Utilisateurs
 */
export const validateUser = (user: Partial<User>): ValidationResult => {
  const errors: string[] = [];

  // Nom
  const nameError = Validators.required(user.name, 'Nom');
  if (nameError) errors.push(nameError);
  else {
    const minLengthError = Validators.minLength(user.name!, 2, 'Nom');
    if (minLengthError) errors.push(minLengthError);
  }

  // Email
  const emailRequiredError = Validators.required(user.email, 'Email');
  if (emailRequiredError) errors.push(emailRequiredError);
  else {
    const emailFormatError = Validators.email(user.email!, 'Email');
    if (emailFormatError) errors.push(emailFormatError);
  }

  // Rôle
  const roleError = Validators.required(user.role, 'Rôle');
  if (roleError) errors.push(roleError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validation des Cours
 */
export const validateCourse = (course: Partial<Course>): ValidationResult => {
  const errors: string[] = [];

  // Titre
  const titleError = Validators.required(course.title, 'Titre');
  if (titleError) errors.push(titleError);

  // Instructeur
  const instructorError = Validators.required(course.instructor, 'Instructeur');
  if (instructorError) errors.push(instructorError);

  // Durée
  const durationError = Validators.required(course.duration, 'Durée');
  if (durationError) errors.push(durationError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validation des Factures
 */
export const validateInvoice = (invoice: Partial<Invoice>): ValidationResult => {
  const errors: string[] = [];

  // Numéro de facture
  const invoiceNumberError = Validators.required(invoice.invoiceNumber, 'Numéro de facture');
  if (invoiceNumberError) errors.push(invoiceNumberError);

  // Nom du client
  const clientNameError = Validators.required(invoice.clientName, 'Nom du client');
  if (clientNameError) errors.push(clientNameError);

  // Montant
  const amountError = Validators.required(invoice.amount, 'Montant');
  if (amountError) errors.push(amountError);
  else {
    const positiveError = Validators.positive(invoice.amount!, 'Montant');
    if (positiveError) errors.push(positiveError);
  }

  // Date d'échéance
  const dueDateError = Validators.required(invoice.dueDate, 'Date d\'échéance');
  if (dueDateError) errors.push(dueDateError);
  else {
    const validDateError = Validators.validDate(invoice.dueDate!, 'Date d\'échéance');
    if (validDateError) errors.push(validDateError);
  }

  // Statut
  if (invoice.status) {
    const validStatuses = ['Draft', 'Sent', 'Paid', 'Overdue'];
    const statusError = Validators.inList(invoice.status, validStatuses, 'Statut');
    if (statusError) errors.push(statusError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validation des Dépenses
 */
export const validateExpense = (expense: Partial<Expense>): ValidationResult => {
  const errors: string[] = [];

  // Catégorie
  const categoryError = Validators.required(expense.category, 'Catégorie');
  if (categoryError) errors.push(categoryError);

  // Description
  const descriptionError = Validators.required(expense.description, 'Description');
  if (descriptionError) errors.push(descriptionError);

  // Montant
  const amountError = Validators.required(expense.amount, 'Montant');
  if (amountError) errors.push(amountError);
  else {
    const positiveError = Validators.positive(expense.amount!, 'Montant');
    if (positiveError) errors.push(positiveError);
  }

  // Date
  const dateError = Validators.required(expense.date, 'Date');
  if (dateError) errors.push(dateError);
  else {
    const validDateError = Validators.validDate(expense.date!, 'Date');
    if (validDateError) errors.push(validDateError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validation des Demandes de Congé
 */
export const validateLeaveRequest = (request: Partial<LeaveRequest>): ValidationResult => {
  const errors: string[] = [];

  // Type
  const typeError = Validators.required(request.type, 'Type de congé');
  if (typeError) errors.push(typeError);

  // Date de début
  const startDateError = Validators.required(request.startDate, 'Date de début');
  if (startDateError) errors.push(startDateError);
  else {
    const validDateError = Validators.validDate(request.startDate!, 'Date de début');
    if (validDateError) errors.push(validDateError);
  }

  // Date de fin
  const endDateError = Validators.required(request.endDate, 'Date de fin');
  if (endDateError) errors.push(endDateError);
  else {
    const validDateError = Validators.validDate(request.endDate!, 'Date de fin');
    if (validDateError) errors.push(validDateError);
    
    // Vérifier que la date de fin est après la date de début
    if (request.startDate && request.endDate) {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      if (endDate < startDate) {
        errors.push('La date de fin doit être après la date de début');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Fonction helper pour valider et lancer une erreur si invalide
 */
export const validateOrThrow = (
  data: any,
  validator: (data: any) => ValidationResult,
  context: string
): void => {
  const result = validator(data);
  if (!result.isValid) {
    throw new EcosystiaError(
      result.errors.join(', '),
      ERROR_CODES.VALIDATION_INVALID_FORMAT,
      context
    );
  }
};

