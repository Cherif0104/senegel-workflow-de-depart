import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { mockUsers } from '../constants/data';
import NexusFlowIcon from './icons/NexusFlowIcon';
import { Role } from '../types';
import AuthAIAssistant from './AuthAIAssistant';

interface LoginProps {
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('manager');
  const { login } = useAuth();
  const { t } = useLocalization();
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userToLogin = Object.values(mockUsers).find(u => u.role === selectedRole) || mockUsers.student;
    login(userToLogin);
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

            {/* Right Panel - Formulaire moderne */}
            <div className="md:w-1/2 p-8 md:p-12 bg-white">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('login_title')}</h2>
                <p className="text-gray-600">Bienvenue ! Sélectionnez votre rôle pour continuer</p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                {/* Sélection de rôle améliorée */}
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-user-tag mr-2 text-blue-600"></i>
                    {t('loginAs')}
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as Role)}
                      className="mt-1 block w-full pl-4 pr-10 py-3 text-base border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl shadow-sm hover:border-blue-300 transition-colors bg-gray-50"
                    >
                      <optgroup label={t('youth')}>
                        <option value="student">{t('student')}</option>
                        <option value="entrepreneur">{t('entrepreneur')}</option>
                      </optgroup>
                      <optgroup label={t('partner')}>
                        <option value="employer">{t('employer')}</option>
                        <option value="trainer">{t('trainer')}</option>
                        <option value="funder">{t('funder')}</option>
                        <option value="implementer">{t('implementer')}</option>
                      </optgroup>
                      <optgroup label={t('contributor_category')}>
                        <option value="mentor">{t('mentor')}</option>
                        <option value="coach">{t('coach')}</option>
                        <option value="facilitator">{t('facilitator')}</option>
                        <option value="publisher">{t('publisher')}</option>
                        <option value="editor">{t('editor')}</option>
                        <option value="producer">{t('producer')}</option>
                        <option value="artist">{t('artist')}</option>
                        <option value="alumni">{t('alumni')}</option>
                      </optgroup>
                      <optgroup label={t('staff_category')}>
                        <option value="intern">{t('intern')}</option>
                        <option value="supervisor">{t('supervisor')}</option>
                        <option value="manager">{t('manager')}</option>
                        <option value="administrator">{t('administrator')}</option>
                      </optgroup>
                      <optgroup label={t('super_admin_category')}>
                        <option value="super_administrator">{t('super_administrator')}</option>
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-600">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>

                {/* Mot de passe oublié */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a href="#" onClick={(e) => { e.preventDefault(); openAssistant(t('auth_ai_prompt_password')); }} className="font-medium text-blue-600 hover:text-blue-700 flex items-center group">
                      <i className="fas fa-key mr-2 group-hover:rotate-12 transition-transform"></i>
                      {t('forgot_password')}
                    </a>
                  </div>
                </div>

                {/* Bouton de connexion moderne */}
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    {t('login')}
                  </button>
                </div>
              </form>

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