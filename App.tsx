import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigation } from './hooks/useNavigation';
import { mockCourses, mockJobs, mockGoals, mockContacts, mockDocuments, mockAllUsers, mockTimeLogs, mockLeaveRequests, mockInvoices, mockExpenses, mockRecurringInvoices, mockRecurringExpenses, mockBudgets, mockMeetings } from './constants/data';
import { projectService } from './services/projectService';
import { userService, testConnection } from './services/dataService';
import { Course, Job, Project, Objective, Contact, Document, User, Role, TimeLog, LeaveRequest, Invoice, Expense, AppNotification, RecurringInvoice, RecurringExpense, RecurrenceFrequency, Budget, Meeting } from './types';
import { generateProjectId, generateUserId, generateCourseId, generateContactId, generateInvoiceId, generateExpenseId, generateBudgetId, generateMeetingId, generateLeaveRequestId, generateTimeLogId, generateRecurringInvoiceId, generateRecurringExpenseId, generateInvoiceNumber } from './utils/idGenerator';
import { useLocalization } from './contexts/LocalizationContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { NotificationProvider, useNotification } from './components/common/Notification';
import LoadingScreen from './components/common/LoadingScreen';
import { useErrorHandler } from './utils/errorHandling';

import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import Jobs from './components/Jobs';
import AICoach from './components/AICoach';
import Settings from './components/Settings';
import Projects from './components/Projects';
import ProjectsModern from './components/ProjectsModern';
import GenAILab from './components/GenAILab';
import CourseDetail from './components/CourseDetail';
import CourseManagement from './components/CourseManagement';
import Analytics from './components/Analytics';
import TalentAnalytics from './components/TalentAnalytics';
import Goals from './components/Goals';
import CRM from './components/CRM';
import KnowledgeBase from './components/KnowledgeBase';
import CreateJob from './components/CreateJob';
import UserManagement from './components/UserManagement';
import AIAgent from './components/AIAgent';
import TimeTracking from './components/TimeTracking';
import LeaveManagement from './components/LeaveManagement';
import Finance from './components/Finance';


const App: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const { currentPage, navigateTo, getDisplayPage, isLoadingPage } = useNavigation();
  const { t } = useLocalization();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Lifted State
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [projects, setProjects] = useState<Project[]>([]); // ✅ Données Appwrite uniquement
  const [objectives, setObjectives] = useState<Objective[]>(mockGoals);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [users, setUsers] = useState<User[]>(mockAllUsers);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(mockTimeLogs);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>(mockRecurringInvoices);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(mockRecurringExpenses);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [reminderDays, setReminderDays] = useState<number>(3);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);


  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  
  // Charger les données depuis Appwrite quand l'utilisateur se connecte
  useEffect(() => {
    if (user && user.id) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user?.id) return;
    
    try {
      // Tester la connexion Appwrite
      const isConnected = await testConnection();
      if (!isConnected) {
        console.warn('Appwrite non connecté, utilisation des données mockées');
        return;
      }

      console.log('🔄 Chargement des données depuis Appwrite...');
      
      // Charger les projets (toujours, même si vide)
      const appwriteProjects = await projectService.getAll();
      setProjects(appwriteProjects); // Toujours mettre à jour
      
      if (appwriteProjects.length > 0) {
        console.log(`✅ ${appwriteProjects.length} projets chargés depuis Appwrite`);
      } else {
        console.log('ℹ️ Aucun projet trouvé - Base de données vide');
      }
      
      // Charger les utilisateurs
      const appwriteUsers = await userService.getAll();
      if (appwriteUsers.length > 0) {
        setUsers(appwriteUsers);
        console.log(`✅ ${appwriteUsers.length} utilisateurs chargés depuis Appwrite`);
      }
      
      console.log('✅ Données Appwrite chargées avec succès');
      
    } catch (error) {
      console.error('❌ Erreur chargement données Appwrite:', error);
      setProjects([]); // S'assurer que projects est vide en cas d'erreur
    }
  };
  
    // --- Recurring Item Generation ---
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newInvoices: Invoice[] = [];
        const updatedRecurringInvoices = recurringInvoices.map(ri => {
            const lastGen = new Date(ri.lastGeneratedDate);
            const nextGen = new Date(lastGen);
            if (ri.frequency === 'Monthly') nextGen.setMonth(nextGen.getMonth() + 1);
            else if (ri.frequency === 'Quarterly') nextGen.setMonth(nextGen.getMonth() + 3);
            else if (ri.frequency === 'Annually') nextGen.setFullYear(nextGen.getFullYear() + 1);

            if (today >= nextGen && (!ri.endDate || today <= new Date(ri.endDate))) {
                newInvoices.push({
                    id: generateInvoiceId(),
                    invoiceNumber: generateInvoiceNumber(),
                    clientName: ri.clientName,
                    amount: ri.amount,
                    dueDate: nextGen.toISOString().split('T')[0],
                    status: 'Sent',
                    recurringSourceId: ri.id,
                });
                return { ...ri, lastGeneratedDate: today.toISOString().split('T')[0] };
            }
            return ri;
        });

        if (newInvoices.length > 0) {
            setInvoices(prev => [...prev, ...newInvoices]);
            setRecurringInvoices(updatedRecurringInvoices);
        }

        const newExpenses: Expense[] = [];
        const updatedRecurringExpenses = recurringExpenses.map(re => {
            const lastGen = new Date(re.lastGeneratedDate);
            const nextGen = new Date(lastGen);
            if (re.frequency === 'Monthly') nextGen.setMonth(nextGen.getMonth() + 1);
            else if (re.frequency === 'Quarterly') nextGen.setMonth(nextGen.getMonth() + 3);
            else if (re.frequency === 'Annually') nextGen.setFullYear(nextGen.getFullYear() + 1);

            if (today >= nextGen && (!re.endDate || today <= new Date(re.endDate))) {
                 newExpenses.push({
                    id: generateExpenseId(),
                    category: re.category,
                    description: re.description,
                    amount: re.amount,
                    date: today.toISOString().split('T')[0],
                    dueDate: nextGen.toISOString().split('T')[0],
                    status: 'Unpaid',
                    recurringSourceId: re.id,
                });
                return { ...re, lastGeneratedDate: today.toISOString().split('T')[0] };
            }
            return re;
        });

        if (newExpenses.length > 0) {
            setExpenses(prev => [...prev, ...newExpenses]);
            setRecurringExpenses(updatedRecurringExpenses);
        }

    }, []); // Run only on app load


  // --- Notification Generation ---
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newNotifications: AppNotification[] = [];

    invoices.forEach(inv => {
        if (inv.status === 'Paid') return;
        const dueDate = new Date(inv.dueDate);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= reminderDays) {
            newNotifications.push({
                id: `inv-${inv.id}`,
                message: t('invoice_due_reminder').replace('{invoiceNumber}', inv.invoiceNumber).replace('{dueDate}', inv.dueDate),
                date: inv.dueDate,
                entityType: 'invoice',
                entityId: inv.id,
                isRead: false
            });
        }
    });

    expenses.forEach(exp => {
        if (!exp.dueDate) return;
        const dueDate = new Date(exp.dueDate);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= reminderDays) {
            newNotifications.push({
                id: `exp-${exp.id}`,
                message: t('expense_due_reminder').replace('{description}', exp.description).replace('{dueDate}', exp.dueDate),
                date: exp.dueDate,
                entityType: 'expense',
                entityId: exp.id,
                isRead: false
            });
        }
    });

    setNotifications(newNotifications.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

  }, [invoices, expenses, reminderDays, t]);

  // --- Signup Handler ---
  const handleUserSignup = (signupData: Omit<User, 'id' | 'avatar' | 'skills'>) => {
    const userId = generateUserId();
    const newUser: User = {
      id: userId,
      ...signupData,
      avatar: `https://picsum.photos/seed/${userId}/100/100`,
      skills: [],
    };
    setUsers(prev => [...prev, newUser]);
    login(newUser);
  };

  // Écran de chargement pour éviter le flash (loading général + loading page)
  if (isLoading || isLoadingPage) {
    return <LoadingScreen />;
  }

  // Gestion de l'authentification
  if (!user) {
    if (authView === 'signup') {
        return <Signup onSignup={handleUserSignup} onSwitchToLogin={() => setAuthView('login')} allUsers={users} />;
    }
    return <Login onSwitchToSignup={() => setAuthView('signup')} />;
  }

  // --- CRUD & State Handlers ---
  
    // NOTIFICATIONS
    const handleMarkNotificationAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleClearAllNotifications = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    // RECURRING INVOICES
    const handleAddRecurringInvoice = (data: Omit<RecurringInvoice, 'id'>) => setRecurringInvoices(prev => [{ ...data, id: generateRecurringInvoiceId() }, ...prev]);
    const handleUpdateRecurringInvoice = (updated: RecurringInvoice) => setRecurringInvoices(prev => prev.map(i => i.id === updated.id ? updated : i));
    const handleDeleteRecurringInvoice = (id: string) => setRecurringInvoices(prev => prev.filter(i => i.id !== id));

    // RECURRING EXPENSES
    const handleAddRecurringExpense = (data: Omit<RecurringExpense, 'id'>) => setRecurringExpenses(prev => [{ ...data, id: generateRecurringExpenseId() }, ...prev]);
    const handleUpdateRecurringExpense = (updated: RecurringExpense) => setRecurringExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
    const handleDeleteRecurringExpense = (id: string) => setRecurringExpenses(prev => prev.filter(e => e.id !== id));


  // INVOICES
    const handleAddInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
        const newInvoice: Invoice = { ...invoiceData, id: generateInvoiceId() };
        setInvoices(prev => [newInvoice, ...prev]);
    };
    const handleUpdateInvoice = (updatedInvoice: Invoice) => {
        setInvoices(prev => prev.map(i => i.id === updatedInvoice.id ? updatedInvoice : i));
    };
    const handleDeleteInvoice = (invoiceId: string) => {
        setInvoices(prev => prev.filter(i => i.id !== invoiceId));
    };

    // EXPENSES
    const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
        const newExpense: Expense = { ...expenseData, id: generateExpenseId() };
        setExpenses(prev => [newExpense, ...prev]);
    };
    const handleUpdateExpense = (updatedExpense: Expense) => {
        setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    };
    const handleDeleteExpense = (expenseId: string) => {
        setExpenses(prev => prev.filter(e => e.id !== expenseId));
    };
    
    // BUDGETS
    const handleAddBudget = (budgetData: Omit<Budget, 'id'>) => {
        const newBudget: Budget = { ...budgetData, id: generateBudgetId() };
        setBudgets(prev => [newBudget, ...prev]);
    };
    const handleUpdateBudget = (updatedBudget: Budget) => {
        setBudgets(prev => prev.map(b => b.id === updatedBudget.id ? updatedBudget : b));
    };
    const handleDeleteBudget = (budgetId: string) => {
        const budgetToDelete = budgets.find(b => b.id === budgetId);
        if (!budgetToDelete) return;
        
        const itemIdsToDelete = new Set<string>();
        budgetToDelete.budgetLines.forEach(line => {
            line.items.forEach(item => {
                itemIdsToDelete.add(item.id);
            });
        });

        // Unlink expenses from the deleted budget items
        setExpenses(prev => prev.map(e => 
            e.budgetItemId && itemIdsToDelete.has(e.budgetItemId) 
            ? { ...e, budgetItemId: undefined } 
            : e
        ));

        setBudgets(prev => prev.filter(b => b.id !== budgetId));
    };

  // MEETINGS
  const handleAddMeeting = (meetingData: Omit<Meeting, 'id'>) => {
      const newMeeting: Meeting = { ...meetingData, id: generateMeetingId() };
      setMeetings(prev => [newMeeting, ...prev].sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()));
  };
  const handleUpdateMeeting = (updatedMeeting: Meeting) => {
      setMeetings(prev => prev.map(m => m.id === updatedMeeting.id ? updatedMeeting : m).sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()));
  };
  const handleDeleteMeeting = (meetingId: string) => {
      setMeetings(prev => prev.filter(m => m.id !== meetingId));
  };


  // LEAVE REQUESTS
  const handleAddLeaveRequest = (requestData: Omit<LeaveRequest, 'id' | 'userId' | 'userName' | 'userAvatar' | 'status'>) => {
    if (!user) return;
    const newRequest: LeaveRequest = {
      id: generateLeaveRequestId(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      status: 'Pending',
      ...requestData,
    };
    setLeaveRequests(prev => [newRequest, ...prev]);
  };

  const handleUpdateLeaveRequestStatus = (requestId: string, status: 'Approved' | 'Rejected') => {
      setLeaveRequests(prev => prev.map(req => req.id === requestId ? {...req, status} : req));
  }


  // TIME LOGS
  const handleAddTimeLog = (logData: Omit<TimeLog, 'id' | 'userId'>) => {
    if (!user) return;
    const newLog: TimeLog = {
      id: generateTimeLogId(),
      userId: user.id,
      ...logData,
    };
    setTimeLogs(prev => [newLog, ...prev]);
  };


  // USERS
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    // Also update user in project teams if they are part of any
    setProjects(prevProjects => prevProjects.map(p => ({
        ...p,
        team: p.team.map(member => member.id === updatedUser.id ? updatedUser : member)
    })));
  };

  // JOBS
  const handleAddJob = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
    handleSetView('jobs');
  };
  
  // PROJECTS
  const handleAddProject = async (projectData: Omit<Project, 'id' | 'tasks' | 'risks'>) => {
      if (user?.id) {
          try {
              // Sauvegarder dans Appwrite
              const savedProject = await projectService.create({
                  ...projectData,
                  tasks: [],
                  risks: []
              }, user.id);
              
              if (savedProject) {
                  setProjects(prev => [savedProject, ...prev]);
                  
                  // Notification de succès
                  addToast({
                      message: `Projet "${savedProject.title}" créé avec succès ! 🎉`,
                      type: 'success'
                  });
                  
                  console.log('✅ Projet sauvegardé dans Appwrite');
                  return;
              }
          } catch (error) {
              // Notification d'erreur
              addToast({
                  message: `Erreur lors de la création du projet : ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
                  type: 'error'
              });
              throw error;
          }
      }
      
      // Fallback vers les données locales
      const newProject: Project = {
          id: generateProjectId(),
          ...projectData,
          tasks: [],
          risks: [],
          tags: projectData.tags || [],
          priority: projectData.priority || 'Medium',
      };
      setProjects(prev => [newProject, ...prev]);
      
      // Notification pour mode hors ligne
      addToast({
          message: 'Projet créé (mode hors ligne)',
          type: 'info'
      });
  };
  
  const handleUpdateProject = async (updatedProject: Project) => {
      if (user?.id && typeof updatedProject.id === 'string') {
          try {
              // Mettre à jour dans Appwrite
              const success = await projectService.update(updatedProject.id, updatedProject, user.id);
              
              if (success) {
                  setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
                  
                  // Notification de succès
                  addToast({
                      message: `Projet "${updatedProject.title}" mis à jour avec succès ! ✅`,
                      type: 'success'
                  });
                  
                  console.log('✅ Projet mis à jour dans Appwrite');
                  return;
              }
          } catch (error) {
              // Notification d'erreur
              addToast({
                  message: `Erreur lors de la mise à jour : ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
                  type: 'error'
              });
              throw error;
          }
      }
      
      // Fallback vers les données locales
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      
      addToast({
          message: 'Projet mis à jour (mode hors ligne)',
          type: 'info'
      });
  };
  
  const handleDeleteProject = async (projectId: number | string) => {
      if (user?.id && typeof projectId === 'string') {
          // Essayer de supprimer dans Appwrite
          const success = await projectService.delete(projectId);
          if (success) {
              setProjects(prev => prev.filter(p => p.id !== projectId));
              console.log('✅ Projet supprimé de Appwrite');
              // Also delete related OKRs
              setObjectives(prev => prev.filter(o => o.projectId !== projectId));
              return;
          }
      }
      
      // Fallback vers les données locales
      setProjects(prev => prev.filter(p => p.id !== projectId));
      // Also delete related OKRs
      setObjectives(prev => prev.filter(o => o.projectId !== projectId));
  };

  // OBJECTIVES (OKRs)
  const handleSetObjectives = (newObjectives: Objective[]) => {
      setObjectives(newObjectives);
  };
  const handleAddObjective = (objectiveData: Omit<Objective, 'id'>) => {
      const newObjective: Objective = { ...objectiveData, id: `obj-${Date.now()}` };
      setObjectives(prev => [...prev, newObjective]);
  };
  const handleUpdateObjective = (updatedObjective: Objective) => {
      setObjectives(prev => prev.map(o => o.id === updatedObjective.id ? updatedObjective : o));
  };
  const handleDeleteObjective = (objectiveId: string) => {
      setObjectives(prev => prev.filter(o => o.id !== objectiveId));
  };


  // COURSES
  const handleAddCourse = (courseData: Omit<Course, 'id' | 'progress'>) => {
      const newCourse: Course = {
          id: generateCourseId(),
          progress: 0,
          ...courseData,
      };
      setCourses(prev => [newCourse, ...prev]);
  };
  const handleUpdateCourse = (updatedCourse: Course) => {
      setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };
  const handleDeleteCourse = (courseId: string) => {
      setCourses(prev => prev.filter(c => c.id !== courseId));
  };


  // CONTACTS (CRM)
  const handleAddContact = (contactData: Omit<Contact, 'id'>) => {
      const newContact: Contact = { ...contactData, id: generateContactId() };
      setContacts(prev => [newContact, ...prev]);
  };
  const handleUpdateContact = (updatedContact: Contact) => {
      setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
  };
  const handleDeleteContact = (contactId: string) => {
      setContacts(prev => prev.filter(c => c.id !== contactId));
  };

  
  // DOCUMENTS (Knowledge Base)
  const handleAddDocument = (newDocument: Document) => {
      setDocuments(prev => [newDocument, ...prev]);
  }

  // --- View Management ---

  const handleSetView = (view: string) => {
    navigateTo(view);
    if (view !== 'course_detail') {
      setSelectedCourseId(null);
    }
    if(window.innerWidth < 1024) { 
        setSidebarOpen(false);
    }
  }

  const handleSelectCourse = (id: number) => {
    setSelectedCourseId(id);
    navigateTo('course_detail');
  }

  const renderView = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setView={handleSetView} projects={projects} courses={courses} jobs={jobs} timeLogs={timeLogs} leaveRequests={leaveRequests} invoices={invoices} expenses={expenses} />;
      case 'time_tracking':
        return <TimeTracking 
                    timeLogs={timeLogs} 
                    onAddTimeLog={handleAddTimeLog} 
                    projects={projects} 
                    courses={courses}
                    meetings={meetings}
                    users={users}
                    onAddMeeting={handleAddMeeting}
                    onUpdateMeeting={handleUpdateMeeting}
                    onDeleteMeeting={handleDeleteMeeting}
                />;
      case 'projects':
        return <ProjectsModern 
                    projects={projects} 
                    users={users}
                    timeLogs={timeLogs}
                    onUpdateProject={handleUpdateProject} 
                    onAddProject={handleAddProject}
                    onDeleteProject={handleDeleteProject}
                    onAddTimeLog={handleAddTimeLog}
                />;
      case 'goals_okrs':
        return <Goals 
                    projects={projects} 
                    objectives={objectives} 
                    setObjectives={handleSetObjectives} 
                    onAddObjective={handleAddObjective}
                    onUpdateObjective={handleUpdateObjective}
                    onDeleteObjective={handleDeleteObjective}
                />;
      case 'courses':
        return <Courses courses={courses} onSelectCourse={handleSelectCourse} />;
      case 'course_detail':
        const course = courses.find(c => c.id === selectedCourseId);
        return course ? <CourseDetail course={course} onBack={() => handleSetView('courses')} timeLogs={timeLogs} onAddTimeLog={handleAddTimeLog} projects={projects} onUpdateCourse={handleUpdateCourse} /> : <Courses courses={courses} onSelectCourse={handleSelectCourse}/>;
      case 'course_management':
          return <CourseManagement 
                    courses={courses} 
                    onAddCourse={handleAddCourse}
                    onUpdateCourse={handleUpdateCourse}
                    onDeleteCourse={handleDeleteCourse}
                  />;
      case 'jobs':
        return <Jobs jobs={jobs} setJobs={setJobs} setView={handleSetView}/>;
      case 'create_job':
        return <CreateJob onAddJob={handleAddJob} onBack={() => handleSetView('jobs')} />;
      case 'user_management':
        return <UserManagement users={users} onUpdateUser={handleUpdateUser} />;
      case 'crm_sales':
        return <CRM 
                    contacts={contacts} 
                    onAddContact={handleAddContact}
                    onUpdateContact={handleUpdateContact}
                    onDeleteContact={handleDeleteContact}
                />;
      case 'knowledge_base':
        return <KnowledgeBase documents={documents} onAddDocument={handleAddDocument} />;
      case 'leave_management':
        return <LeaveManagement 
                    leaveRequests={leaveRequests}
                    onAddLeaveRequest={handleAddLeaveRequest}
                    onUpdateLeaveRequestStatus={handleUpdateLeaveRequestStatus}
                />;
      case 'finance':
        return <Finance 
                    invoices={invoices}
                    expenses={expenses}
                    recurringInvoices={recurringInvoices}
                    recurringExpenses={recurringExpenses}
                    budgets={budgets}
                    projects={projects}
                    onAddInvoice={handleAddInvoice}
                    onUpdateInvoice={handleUpdateInvoice}
                    onDeleteInvoice={handleDeleteInvoice}
                    onAddExpense={handleAddExpense}
                    onUpdateExpense={handleUpdateExpense}
                    onDeleteExpense={handleDeleteExpense}
                    onAddRecurringInvoice={handleAddRecurringInvoice}
                    onUpdateRecurringInvoice={handleUpdateRecurringInvoice}
                    onDeleteRecurringInvoice={handleDeleteRecurringInvoice}
                    onAddRecurringExpense={handleAddRecurringExpense}
                    onUpdateRecurringExpense={handleUpdateRecurringExpense}
                    onDeleteRecurringExpense={handleDeleteRecurringExpense}
                    onAddBudget={handleAddBudget}
                    onUpdateBudget={handleUpdateBudget}
                    onDeleteBudget={handleDeleteBudget}
                />;
      case 'ai_coach':
        return <AICoach />;
      case 'gen_ai_lab':
        return <GenAILab />;
      case 'analytics':
        return <Analytics setView={handleSetView} />;
      case 'talent_analytics':
        return <TalentAnalytics setView={handleSetView} />;
      case 'settings':
        return <Settings reminderDays={reminderDays} onSetReminderDays={setReminderDays} />;
      default:
        return <Dashboard setView={handleSetView} projects={projects} courses={courses} jobs={jobs} timeLogs={timeLogs} leaveRequests={leaveRequests} invoices={invoices} expenses={expenses}/>;
    }
  };
  
  // Écran de chargement pendant la vérification de session
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement d'Ecosystia...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className="flex h-screen bg-gray-100">
          <Sidebar currentView={currentPage} setView={handleSetView} isOpen={isSidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                setView={handleSetView}
                notifications={notifications}
                onMarkNotificationAsRead={handleMarkNotificationAsRead}
                onClearAllNotifications={handleClearAllNotifications}
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
              <div className="container mx-auto px-6 py-8">
                {renderView()}
              </div>
            </main>
          </div>
           {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"></div>}
           <AIAgent currentView={currentPage} />
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;
