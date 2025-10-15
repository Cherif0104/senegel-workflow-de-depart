/**
 * 👥 SERVICE UTILISATEURS - ECOSYSTIA
 * Gestion complète des utilisateurs avec Appwrite
 * Référence : MERISE/02-MLD-MPD-IMPLEMENTATION-APPWRITE.md - Collection 1
 */

import { databases, DATABASE_ID, COLLECTION_IDS, ID, Query } from './appwriteService';
import { User, Role } from '../types';

class UserService {
  private get collectionId() {
    return 'users';
  }

  /**
   * Convertir un document Appwrite en User
   */
  private mapFromAppwrite(doc: any): User {
    return {
      id: doc.$id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      avatar: doc.avatar || '',
      role: doc.role,
      skills: doc.skills ? JSON.parse(doc.skills) : [],
      phone: doc.phone || '',
    };
  }

  /**
   * Convertir un User en document Appwrite
   */
  private mapToAppwrite(user: Partial<User>): any {
    const data: any = {};
    
    if (user.firstName !== undefined) data.firstName = user.firstName;
    if (user.lastName !== undefined) data.lastName = user.lastName;
    if (user.email !== undefined) data.email = user.email;
    if (user.avatar !== undefined) data.avatar = user.avatar;
    if (user.role !== undefined) data.role = user.role;
    if (user.skills !== undefined) data.skills = JSON.stringify(user.skills);
    if (user.phone !== undefined) data.phone = user.phone;
    
    return data;
  }

  /**
   * Récupérer tous les utilisateurs
   */
  async getAll(): Promise<User[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId
      );
      
      console.log(`✅ ${response.documents.length} utilisateurs récupérés`);
      return response.documents.map(doc => this.mapFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération utilisateurs:', error);
      return [];
    }
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getById(id: string): Promise<User | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        this.collectionId,
        id
      );
      
      console.log('✅ Utilisateur récupéré:', id);
      return this.mapFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur récupération utilisateur:', error);
      return null;
    }
  }

  /**
   * Récupérer un utilisateur par email
   */
  async getByEmail(email: string): Promise<User | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId,
        [Query.equal('email', email)]
      );
      
      if (response.documents.length > 0) {
        console.log('✅ Utilisateur trouvé par email:', email);
        return this.mapFromAppwrite(response.documents[0]);
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erreur récupération utilisateur par email:', error);
      return null;
    }
  }

  /**
   * Mettre à jour un utilisateur
   */
  async update(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const appwriteData = this.mapToAppwrite(userData);
      
      const response = await databases.updateDocument(
        DATABASE_ID,
        this.collectionId,
        id,
        appwriteData
      );
      
      console.log('✅ Utilisateur mis à jour dans Appwrite:', id);
      return this.mapFromAppwrite(response);
    } catch (error) {
      console.error('❌ Erreur mise à jour utilisateur:', error);
      throw error;
    }
  }

  /**
   * Récupérer les utilisateurs par rôle
   */
  async getByRole(role: Role): Promise<User[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId,
        [Query.equal('role', role)]
      );
      
      console.log(`✅ ${response.documents.length} utilisateurs avec rôle "${role}"`);
      return response.documents.map(doc => this.mapFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur récupération utilisateurs par rôle:', error);
      return [];
    }
  }

  /**
   * Rechercher des utilisateurs par nom
   */
  async searchByName(name: string): Promise<User[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId,
        [Query.search('firstName', name)]
      );
      
      console.log(`✅ ${response.documents.length} utilisateurs trouvés pour "${name}"`);
      return response.documents.map(doc => this.mapFromAppwrite(doc));
    } catch (error) {
      console.error('❌ Erreur recherche utilisateurs:', error);
      return [];
    }
  }

  /**
   * Récupérer les utilisateurs avec des compétences spécifiques
   */
  async getBySkills(skills: string[]): Promise<User[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId
      );
      
      const users = response.documents.map(doc => this.mapFromAppwrite(doc));
      const filteredUsers = users.filter(user => 
        skills.some(skill => user.skills.includes(skill))
      );
      
      console.log(`✅ ${filteredUsers.length} utilisateurs avec les compétences requises`);
      return filteredUsers;
    } catch (error) {
      console.error('❌ Erreur récupération utilisateurs par compétences:', error);
      return [];
    }
  }

  /**
   * Obtenir les statistiques des utilisateurs
   */
  async getStats(): Promise<{
    total: number;
    byRole: Record<Role, number>;
    bySkills: Record<string, number>;
  }> {
    try {
      const users = await this.getAll();
      
      const byRole = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<Role, number>);
      
      const bySkills = users.reduce((acc, user) => {
        user.skills.forEach(skill => {
          acc[skill] = (acc[skill] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);
      
      return {
        total: users.length,
        byRole,
        bySkills
      };
    } catch (error) {
      console.error('❌ Erreur statistiques utilisateurs:', error);
      return {
        total: 0,
        byRole: {} as Record<Role, number>,
        bySkills: {}
      };
    }
  }
}

export const userService = new UserService();
