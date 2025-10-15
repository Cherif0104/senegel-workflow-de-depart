

export type Role = 'student' | 'employer' | 'super_administrator' | 'administrator' | 'manager' | 'supervisor' | 'editor' | 'entrepreneur' | 'funder' | 'mentor' | 'intern' | 'trainer' | 'implementer' | 'coach' | 'facilitator' | 'publisher' | 'producer' | 'artist' | 'alumni';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  skills: string[];
  phone?: string;
  location?: string;
}

export interface FileAttachment {
  fileName: string;
  dataUrl: string;
}

export type EvidenceDocument = FileAttachment;
export type Receipt = FileAttachment;

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz';
  duration: string;
  icon: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  evidenceDocuments?: EvidenceDocument[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  progress: number;
  icon: string;
  description: string;
  modules: Module[];
  completedLessons?: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  postedDate: string;
  description: string;
  requiredSkills: string[];
  applicants: User[];
}

export interface Task {
  id: string;
  text: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  assignee?: User;
  estimatedTime?: number;
  loggedTime?: number;
  dueDate?: string;
}

export interface Risk {
  id: string;
  description: string;
  likelihood: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  mitigationStrategy: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  budget?: number;
  client?: string;
  tags: string[];
  team: User[];
  tasks: Task[];
  risks: Risk[];
  createdAt?: string;
  updatedAt?: string;
}

export interface KeyResult {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  objectiveId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Objective {
  id: string;
  projectId: string;
  title: string;
  keyResults: KeyResult[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  workEmail: string;
  personalEmail?: string;
  company: string;
  status: 'Lead' | 'Contacted' | 'Prospect' | 'Customer';
  avatar: string;
  officePhone?: string;
  mobilePhone?: string;
  whatsappNumber?: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface TimeLog {
  id: string;
  userId: string;
  entityType: 'project' | 'course' | 'task';
  entityId: string;
  entityTitle: string;
  date: string;
  duration: number; // in minutes
  description: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'Congé payé' | 'Congé maladie' | 'RTT' | 'Sans solde' | 'Formation';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;  // ID de l'admin qui a validé/rejeté
  reviewedAt?: string;  // Date de validation/rejet
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Partially Paid';
  receipt?: Receipt;
  paidDate?: string;
  paidAmount?: number;
  recurringSourceId?: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  dueDate?: string;
  receipt?: Receipt;
  status: 'Paid' | 'Unpaid';
  budgetItemId?: string;
  recurringSourceId?: string;
}

export type RecurrenceFrequency = 'Monthly' | 'Quarterly' | 'Annually';

export interface RecurringInvoice {
    id: string;
    clientName: string;
    amount: number;
    frequency: RecurrenceFrequency;
    startDate: string;
    endDate?: string;
    lastGeneratedDate: string;
}

export interface RecurringExpense {
    id: string;
    category: string;
    description: string;
    amount: number;
    frequency: RecurrenceFrequency;
    startDate: string;
    endDate?: string;
    lastGeneratedDate: string;
}

export interface BudgetItem {
    id: string;
    description: string;
    amount: number;
}

export interface BudgetLine {
    id: string;
    title: string;
    items: BudgetItem[];
}

export interface Budget {
    id: string;
    title: string;
    type: 'Project' | 'Office';
    amount: number;
    startDate: string;
    endDate: string;
    projectId?: string;
    budgetLines: BudgetLine[];
}

export interface Meeting {
    id: string;
    title: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
    attendees: User[];
    organizerId: string;
    description?: string;
}

export enum Language {
    EN = 'en',
    FR = 'fr',
}

export type Translation = { [key: string]: string };
export type Translations = { [key in Language]: Translation };

export interface AppNotification {
    id: string;
    message: string;
    date: string;
    entityType: 'invoice' | 'expense';
    entityId: string;
    isRead: boolean;
}

export interface AgentMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledDate: string;
  progress: number;  // 0-100
  completedLessons: string[];  // Array of lesson IDs
  status: 'Active' | 'Completed' | 'Dropped';
  completionDate?: string;
}

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}