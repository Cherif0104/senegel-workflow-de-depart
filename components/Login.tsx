import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import NexusFlowIcon from './icons/NexusFlowIcon';
import { Role } from '../types';
import AuthAIAssistant from './AuthAIAssistant';

interface LoginProps {
  onSwitchToSignup: () => void;
}

// Configuration des rôles disponibles
const AVAILABLE_ROLES = [
  { role: 'super_administrator', label: 'Super Admin', icon: 'fas fa-crown', color: 'purple' },
  { role: 'administrator', label: 'Administrateur', icon: 'fas fa-user-shield', color: 'red' },
  { role: 'manager', label: 'Manager', icon: 'fas fa-user-tie', color: 'blue' },
  { role: 'supervisor', label: 'Superviseur', icon: 'fas fa-user-check', color: 'green' },
  { role: 'editor', label: 'Éditeur', icon: 'fas fa-edit', color: 'indigo' },
  { role: 'entrepreneur', label: 'Entrepreneur', icon: 'fas fa-rocket', color: 'pink' },
  { role: 'funder', label: 'Financeur', icon: 'fas fa-coins', color: 'yellow' },
  { role: 'mentor', label: 'Mentor', icon: 'fas fa-graduation-cap', color: 'orange' },
  { role: 'intern', label: 'Stagiaire', icon: 'fas fa-user-graduate', color: 'teal' },
  { role: 'trainer', label: 'Formateur', icon: 'fas fa-chalkboard-teacher', color: 'cyan' },
  { role: 'implementer', label: 'Implémenteur', icon: 'fas fa-tools', color: 'lime' },
  { role: 'coach', label: 'Coach', icon: 'fas fa-running', color: 'emerald' },
  { role: 'facilitator', label: 'Facilitateur', icon: 'fas fa-hands-helping', color: 'violet' },
  { role: 'publisher', label: 'Éditeur', icon: 'fas fa-publish', color: 'rose' },
  { role: 'producer', label: 'Producteur', icon: 'fas fa-video', color: 'amber' },
  { role: 'artist', label: 'Artiste', icon: 'fas fa-palette', color: 'fuchsia' },
  { role: 'alumni', label: 'Alumni', icon: 'fas fa-award', color: 'sky' },
  { role: 'student', label: 'Étudiant', icon: 'fas fa-book', color: 'slate' },
  { role: 'employer', label: 'Employeur', icon: 'fas fa-building', color: 'stone' }
];

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [mode, setMode] = useState<'demo' | 'prod'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('manager');
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const { login, isLoading, error } = useAuth();
  const { t } = useLocalization();
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'demo') {
      // Mode démo : connexion directe par rôle
      const success = await login({ email: 'demo@ecosystia.sn', password: 'demo', role: selectedRole });
      if (!success) {
        console.log('Échec de la connexion démo');
      }
    } else {
      // Mode production : authentification complète
      if (!email || !password) {
        alert('Veuillez remplir tous les champs');
        return;
      }

      const success = await login({ email, password });
      if (!success) {
        console.log('Échec de la connexion');
      }
    }
  };

  const handleRoleLogin = async (role: Role) => {
    setSelectedRole(role);
    const success = await login({ email: 'demo@ecosystia.sn', password: 'demo', role });
    if (!success) {
      console.log('Échec de la connexion démo');
    }
  };

  const openAssistant = (prompt: string = '') => {
    setAssistantInitialPrompt(prompt);
    setAssistantOpen(true);
  }

  return (
    <>
      {/* Background moderne avec gradient */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Formes décoratives en arrière-plan */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Container principal */}
        <div className="w-full max-w-6xl mx-auto relative z-10">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden md:flex border border-white/20">
            
            {/* Left Panel - Design moderne */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
              {/* Effet de pattern en arrière-plan */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
              </div>
              
              {/* Contenu */}
              <div className="relative z-10">
                <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
                  <NexusFlowIcon className="w-32 h-32 drop-shadow-2xl"/>
                </div>
                <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  {t('senegel_workflow_platform')}
                </h1>
                <p className="text-lg text-blue-100 mb-8 max-w-md">{t('login_subtitle')}</p>
                
                {/* Stats ou features */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold">500 000</div>
                    <div className="text-xs text-blue-200 mt-1">Utilisateurs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">15+</div>
                    <div className="text-xs text-blue-200 mt-1">Modules</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">99%</div>
                    <div className="text-xs text-blue-200 mt-1">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>

             {/* Right Panel - Sélecteur de modes */}
            <div className="md:w-1/2 p-8 md:p-12 bg-white">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('login_title')}</h2>
                 <p className="text-gray-600">Choisissez votre mode d'accès</p>
               </div>

               {/* Sélecteur de mode */}
               <div className="mb-8">
                 <div className="flex bg-gray-100 rounded-xl p-1">
                   <button
                     type="button"
                     onClick={() => setMode('demo')}
                     className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                       mode === 'demo'
                         ? 'bg-white text-blue-600 shadow-md'
                         : 'text-gray-600 hover:text-gray-800'
                     }`}
                   >
                     <i className="fas fa-flask mr-2"></i>
                     Mode Démo
                   </button>
                   <button
                     type="button"
                     onClick={() => setMode('prod')}
                     className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                       mode === 'prod'
                         ? 'bg-white text-blue-600 shadow-md'
                         : 'text-gray-600 hover:text-gray-800'
                     }`}
                   >
                     <i className="fas fa-lock mr-2"></i>
                     Mode Production
                   </button>
                 </div>
               </div>

               {mode === 'demo' ? (
                 /* Mode Démo - Sélecteur de rôles */
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Sélectionnez votre rôle</h3>
                      <p className="text-gray-600 text-sm">Choisissez un rôle pour tester l'application</p>
              </div>

                    {/* Barre de recherche des rôles */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={roleSearchTerm}
                        onChange={(e) => setRoleSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                      {/* Grille des rôles */}
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {AVAILABLE_ROLES
                        .filter(({ role, label }) => 
                          role.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
                          label.toLowerCase().includes(roleSearchTerm.toLowerCase())
                        )
                        .map(({ role, label, icon, color }) => (
                       <button
                         key={role}
                         onClick={() => handleRoleLogin(role as Role)}
                         disabled={isLoading}
                         className={`p-3 rounded-lg border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                           selectedRole === role
                             ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                             : 'border-gray-200 hover:border-gray-300 text-gray-700'
                         }`}
                       >
                         <div className="text-center">
                           <i className={`${icon} text-lg mb-2 text-${color}-600`}></i>
                           <div className="font-medium text-sm">{label}</div>
                         </div>
                       </button>
                     ))}
                     
                     {/* Message si aucun rôle trouvé */}
                     {AVAILABLE_ROLES.filter(({ role, label }) => 
                       role.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
                       label.toLowerCase().includes(roleSearchTerm.toLowerCase())
                     ).length === 0 && (
                       <div className="col-span-full text-center py-4">
                         <p className="text-gray-500">Aucun rôle trouvé</p>
                       </div>
                     )}
                   </div>

                   {/* Badge Mode Démo */}
                   <div className="text-center">
                     <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                       <i className="fas fa-flask mr-1"></i>
                       Mode Démo
                     </div>
                   </div>
                </div>
               ) : (
                 /* Mode Production - Formulaire d'authentification */
                 <form className="space-y-6" onSubmit={handleLogin}>
                   {/* Champ Email */}
                   <div>
                     <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                       <i className="fas fa-envelope mr-2 text-blue-600"></i>
                       Adresse email
                     </label>
                     <input
                       type="email"
                       id="email"
                       name="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="mt-1 block w-full pl-4 pr-4 py-3 text-base border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl shadow-sm hover:border-blue-300 transition-colors bg-gray-50"
                       placeholder="votre@email.com"
                       required
                     />
                   </div>

                   {/* Champ Mot de passe */}
                   <div>
                     <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                       <i className="fas fa-lock mr-2 text-blue-600"></i>
                       Mot de passe
                     </label>
                     <input
                       type="password"
                       id="password"
                       name="password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="mt-1 block w-full pl-4 pr-4 py-3 text-base border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl shadow-sm hover:border-blue-300 transition-colors bg-gray-50"
                       placeholder="••••••••"
                       required
                     />
                   </div>

                   {/* Message d'erreur */}
                   {error && (
                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                       <i className="fas fa-exclamation-triangle mr-2"></i>
                       {error}
                     </div>
                   )}

                {/* Mot de passe oublié */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a href="#" onClick={(e) => { e.preventDefault(); openAssistant(t('auth_ai_prompt_password')); }} className="font-medium text-blue-600 hover:text-blue-700 flex items-center group">
                      <i className="fas fa-key mr-2 group-hover:rotate-12 transition-transform"></i>
                      {t('forgot_password')}
                    </a>
                  </div>
                </div>

                   {/* Bouton de connexion */}
                  <button
                    type="submit"
                     disabled={isLoading}
                     className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                   >
                     {isLoading ? (
                       <>
                         <i className="fas fa-spinner fa-spin mr-2"></i>
                         Connexion...
                       </>
                     ) : (
                       <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    {t('login')}
                       </>
                     )}
                  </button>
              </form>
               )}

              {/* Séparateur */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Nouveau sur la plateforme ?</span>
                  </div>
                </div>

                {/* Lien d'inscription */}
                <div className="mt-6 text-center">
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }} 
                    className="inline-flex items-center text-base text-blue-600 hover:text-blue-700 font-semibold group"
                  >
                    <i className="fas fa-user-plus mr-2 group-hover:scale-110 transition-transform"></i>
                    {t('signup_prompt')}
                    <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                  </a>
                </div>
              </div>

              {/* Features badges */}
              <div className="mt-8 flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <i className="fas fa-shield-alt mr-1"></i> Sécurisé
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  <i className="fas fa-bolt mr-1"></i> Rapide
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <i className="fas fa-globe mr-1"></i> Multilingue
                </span>
              </div>
            </div>
          </div>

          {/* Note de confidentialité */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <i className="fas fa-lock mr-2"></i>
            Vos données sont protégées et chiffrées de bout en bout
          </div>
        </div>
      </div>

      {/* Bouton d'aide - Design amélioré */}
      <button 
        onClick={() => openAssistant()}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white w-auto h-14 px-6 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 z-50"
      >
        <i className="fas fa-question-circle mr-2 text-lg"></i> 
        {t('need_help')}
      </button>

      {isAssistantOpen && (
        <AuthAIAssistant 
          onClose={() => setAssistantOpen(false)}
          context="login"
          initialPrompt={assistantInitialPrompt}
        />
      )}

      {/* Styles pour les animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default Login;