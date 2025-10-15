/**
 * 📚 SERVICE COURSE ENROLLMENT - ECOSYSTIA
 * Gestion des inscriptions aux cours selon Merise
 * Référence : MERISE/02-MLD-MPD-IMPLEMENTATION-APPWRITE.md - Collection 7
 */

import { databases, DATABASE_ID, ID, Query } from './appwriteService';
import { CourseEnrollment } from '../types';

class CourseEnrollmentService {
  private get collectionId() {
    return 'course_enrollments';
  }

  /**
   * Inscrire un utilisateur à un cours
   */
  async enroll(userId: string, courseId: string): Promise<CourseEnrollment | null> {
    try {
      // Vérifier si déjà inscrit
      const existing = await this.getUserCourseEnrollment(userId, courseId);
      if (existing) {
        console.log('⚠️ Utilisateur déjà inscrit à ce cours');
        return existing;
      }

      const enrollmentData = {
        userId,
        courseId,
        enrolledDate: new Date().toISOString().split('T')[0],
        progress: 0,
        completedLessons: JSON.stringify([]),
        status: 'Active',
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        this.collectionId,
        ID.unique(),
        enrollmentData
      );

      console.log('✅ Inscription créée:', response.$id);

      return {
        id: response.$id,
        userId: response.userId,
        courseId: response.courseId,
        enrolledDate: response.enrolledDate,
        progress: response.progress,
        completedLessons: JSON.parse(response.completedLessons || '[]'),
        status: response.status,
        completionDate: response.completionDate,
      };
    } catch (error) {
      console.error('❌ Erreur inscription cours:', error);
      return null;
    }
  }

  /**
   * Récupérer toutes les inscriptions d'un utilisateur
   */
  async getUserEnrollments(userId: string): Promise<CourseEnrollment[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );

      console.log(`✅ ${response.documents.length} inscriptions trouvées pour l'utilisateur`);

      return response.documents.map(doc => ({
        id: doc.$id,
        userId: doc.userId,
        courseId: doc.courseId,
        enrolledDate: doc.enrolledDate,
        progress: doc.progress,
        completedLessons: JSON.parse(doc.completedLessons || '[]'),
        status: doc.status,
        completionDate: doc.completionDate,
      }));
    } catch (error) {
      console.error('❌ Erreur récupération inscriptions:', error);
      return [];
    }
  }

  /**
   * Récupérer l'inscription d'un utilisateur à un cours spécifique
   */
  async getUserCourseEnrollment(userId: string, courseId: string): Promise<CourseEnrollment | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId,
        [
          Query.equal('userId', userId),
          Query.equal('courseId', courseId),
        ]
      );

      if (response.documents.length === 0) {
        return null;
      }

      const doc = response.documents[0];
      return {
        id: doc.$id,
        userId: doc.userId,
        courseId: doc.courseId,
        enrolledDate: doc.enrolledDate,
        progress: doc.progress,
        completedLessons: JSON.parse(doc.completedLessons || '[]'),
        status: doc.status,
        completionDate: doc.completionDate,
      };
    } catch (error) {
      console.error('❌ Erreur vérification inscription:', error);
      return null;
    }
  }

  /**
   * Mettre à jour la progression (marquer une leçon comme complétée)
   */
  async markLessonCompleted(
    enrollmentId: string,
    lessonId: string,
    totalLessons: number = 10  // À calculer dynamiquement depuis le cours
  ): Promise<CourseEnrollment | null> {
    try {
      // Récupérer l'inscription actuelle
      const enrollment = await databases.getDocument(
        DATABASE_ID,
        this.collectionId,
        enrollmentId
      );

      const completedLessons = JSON.parse(enrollment.completedLessons || '[]');
      
      // Ajouter la leçon si pas déjà complétée
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      // Calculer la nouvelle progression
      const newProgress = Math.min(
        Math.round((completedLessons.length / totalLessons) * 100),
        100
      );

      // Déterminer le nouveau statut
      const newStatus = newProgress === 100 ? 'Completed' : 'Active';
      const completionDate = newProgress === 100 
        ? new Date().toISOString().split('T')[0] 
        : null;

      // Mettre à jour dans Appwrite
      const response = await databases.updateDocument(
        DATABASE_ID,
        this.collectionId,
        enrollmentId,
        {
          completedLessons: JSON.stringify(completedLessons),
          progress: newProgress,
          status: newStatus,
          completionDate,
        }
      );

      console.log(`✅ Progression mise à jour: ${newProgress}%`);

      return {
        id: response.$id,
        userId: response.userId,
        courseId: response.courseId,
        enrolledDate: response.enrolledDate,
        progress: response.progress,
        completedLessons: JSON.parse(response.completedLessons),
        status: response.status,
        completionDate: response.completionDate,
      };
    } catch (error) {
      console.error('❌ Erreur mise à jour progression:', error);
      return null;
    }
  }

  /**
   * Abandonner un cours (Dropped)
   */
  async dropCourse(enrollmentId: string): Promise<boolean> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        this.collectionId,
        enrollmentId,
        { status: 'Dropped' }
      );

      console.log('✅ Cours abandonné');
      return true;
    } catch (error) {
      console.error('❌ Erreur abandon cours:', error);
      return false;
    }
  }

  /**
   * Réactiver une inscription abandonnée
   */
  async reactivateEnrollment(enrollmentId: string): Promise<boolean> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        this.collectionId,
        enrollmentId,
        { status: 'Active' }
      );

      console.log('✅ Inscription réactivée');
      return true;
    } catch (error) {
      console.error('❌ Erreur réactivation:', error);
      return false;
    }
  }

  /**
   * Récupérer tous les étudiants inscrits à un cours
   */
  async getCourseEnrollments(courseId: string): Promise<CourseEnrollment[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        this.collectionId,
        [Query.equal('courseId', courseId), Query.orderDesc('$createdAt')]
      );

      console.log(`✅ ${response.documents.length} inscriptions au cours`);

      return response.documents.map(doc => ({
        id: doc.$id,
        userId: doc.userId,
        courseId: doc.courseId,
        enrolledDate: doc.enrolledDate,
        progress: doc.progress,
        completedLessons: JSON.parse(doc.completedLessons || '[]'),
        status: doc.status,
        completionDate: doc.completionDate,
      }));
    } catch (error) {
      console.error('❌ Erreur récupération inscriptions cours:', error);
      return [];
    }
  }

  /**
   * Obtenir les statistiques d'un cours
   */
  async getCourseStats(courseId: string): Promise<{
    totalEnrolled: number;
    activeStudents: number;
    completedStudents: number;
    droppedStudents: number;
    averageProgress: number;
  }> {
    try {
      const enrollments = await this.getCourseEnrollments(courseId);

      const stats = {
        totalEnrolled: enrollments.length,
        activeStudents: enrollments.filter(e => e.status === 'Active').length,
        completedStudents: enrollments.filter(e => e.status === 'Completed').length,
        droppedStudents: enrollments.filter(e => e.status === 'Dropped').length,
        averageProgress: enrollments.length > 0
          ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
          : 0,
      };

      console.log('📊 Statistiques cours:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Erreur calcul statistiques:', error);
      return {
        totalEnrolled: 0,
        activeStudents: 0,
        completedStudents: 0,
        droppedStudents: 0,
        averageProgress: 0,
      };
    }
  }

  /**
   * Vérifier si un utilisateur a complété un cours
   */
  async hasCompletedCourse(userId: string, courseId: string): Promise<boolean> {
    try {
      const enrollment = await this.getUserCourseEnrollment(userId, courseId);
      return enrollment?.status === 'Completed' || false;
    } catch (error) {
      console.error('❌ Erreur vérification complétion:', error);
      return false;
    }
  }

  /**
   * Obtenir la progression d'un utilisateur sur un cours
   */
  async getUserCourseProgress(userId: string, courseId: string): Promise<number> {
    try {
      const enrollment = await this.getUserCourseEnrollment(userId, courseId);
      return enrollment?.progress || 0;
    } catch (error) {
      console.error('❌ Erreur récupération progression:', error);
      return 0;
    }
  }
}

export const courseEnrollmentService = new CourseEnrollmentService();

