/**
 * 📝 FORMULAIRE PROJET - ECOSYSTIA
 * Formulaire moderne pour créer/modifier des projets
 */

import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { Project, User } from '../types';

interface ProjectFormModalProps {
  project: Project | null;
  users: User[];
  onClose: () => void;
  onSave: (project: Project | Omit<Project, 'id'>) => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ 
  project, 
  users, 
  onClose, 
  onSave 
}) => {
  const { t } = useLocalization();
  const isEditMode = project !== null;
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'Not Started',
    priority: project?.priority || 'Medium',
    dueDate: project?.dueDate || '',
    budget: project?.budget || '',
    client: project?.client || '',
    tags: project?.tags?.join(', ') || '',
    team: project?.team?.map(u => u.id) || [],
  });
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<User[]>(project?.team || []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, team: selectedIds }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La date d\'échéance est obligatoire';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'La date d\'échéance ne peut pas être dans le passé';
      }
    }

    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = 'Le budget doit être un nombre valide';
    }

    if (formData.team.length === 0) {
      newErrors.team = 'Au moins un membre d\'équipe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const teamMembers = users.filter(u => formData.team.includes(u.id));
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      const projectData = {
        ...(isEditMode ? { id: project!.id } : {}),
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status as Project['status'],
        priority: formData.priority as Project['priority'],
        dueDate: formData.dueDate,
        budget: formData.budget ? Number(formData.budget) : undefined,
        client: formData.client.trim() || undefined,
        tags: tags,
        team: teamMembers,
        tasks: project?.tasks || [],
        risks: project?.risks || [],
        ...(isEditMode ? {} : { createdAt: new Date().toISOString() }),
        updatedAt: new Date().toISOString(),
      };

      onSave(projectData as Project | Omit<Project, 'id'>);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Modifier le projet' : 'Créer un nouveau projet'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Colonne gauche */}
              <div className="space-y-6">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-heading mr-2 text-blue-600"></i>
                    Titre du projet *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nom du projet..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-align-left mr-2 text-blue-600"></i>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Description détaillée du projet..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Statut et Priorité */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-flag mr-2 text-blue-600"></i>
                      Statut
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="Not Started">Non démarré</option>
                      <option value="In Progress">En cours</option>
                      <option value="Completed">Terminé</option>
                      <option value="On Hold">En pause</option>
                      <option value="Cancelled">Annulé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-exclamation-triangle mr-2 text-blue-600"></i>
                      Priorité
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="Low">Faible</option>
                      <option value="Medium">Moyenne</option>
                      <option value="High">Élevée</option>
                      <option value="Critical">Critique</option>
                    </select>
                  </div>
                </div>

                {/* Date d'échéance */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
                    Date d'échéance *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.dueDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                  )}
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-6">
                {/* Budget */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-money-bill-wave mr-2 text-blue-600"></i>
                    Budget (FCFA)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.budget && (
                    <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                  )}
                </div>

                {/* Client */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-building mr-2 text-blue-600"></i>
                    Client
                  </label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Nom du client..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-tags mr-2 text-blue-600"></i>
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="tag1, tag2, tag3..."
                  />
                  <p className="mt-1 text-xs text-gray-500">Séparez les tags par des virgules</p>
                </div>

                {/* Équipe */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-users mr-2 text-blue-600"></i>
                    Équipe *
                  </label>
                  <select
                    multiple
                    name="team"
                    value={formData.team}
                    onChange={handleTeamChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-32 ${
                      errors.team ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.role})
                      </option>
                    ))}
                  </select>
                  {errors.team && (
                    <p className="mt-1 text-sm text-red-600">{errors.team}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs membres
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  {isEditMode ? 'Mettre à jour' : 'Créer le projet'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
