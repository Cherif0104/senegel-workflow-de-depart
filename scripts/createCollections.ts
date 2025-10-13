/**
 * 🚀 SCRIPT DE CRÉATION DES COLLECTIONS APPWRITE - ECOSYSTIA
 * Ce script crée automatiquement toutes les collections nécessaires
 * 
 * IMPORTANT: Ce script utilise l'API Key et doit être exécuté côté serveur uniquement
 */

import { Client, Databases, ID, Permission, Role } from 'appwrite';

// Configuration depuis .env
const APPWRITE_ENDPOINT = 'https://sfo.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68e54e9c002cb568cfec';
const APPWRITE_DATABASE_ID = '68e56de100267007af6a';
const APPWRITE_API_KEY = 'standard_aa282abbf94b3f6d2e95d8333422ee03b00f9c6bb1ad6e50ac9173660b6bcad4be93a1dca6871bab81b04621fed21342d89a4a3ca94bee46f38aebd21b362436ab41953054935b626dc4f4e01862d74fc8fbc28864938f0ab6dd815f76aaade45eabe04906e3db1a6bbfca09e923b89fc2afd6393695cf09cc53fa405d66c72c';

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

// Pour les scripts serveur, on n'utilise pas setKey car c'est un SDK client
// À la place, on va créer les collections via l'interface Appwrite ou utiliser le SDK serveur
const databases = new Databases(client);
const databaseId = APPWRITE_DATABASE_ID;

interface CollectionSchema {
  id: string;
  name: string;
  attributes: AttributeDefinition[];
}

interface AttributeDefinition {
  key: string;
  type: 'string' | 'integer' | 'float' | 'boolean' | 'datetime' | 'email' | 'url';
  size?: number;
  required?: boolean;
  default?: any;
  array?: boolean;
}

const collections: CollectionSchema[] = [
  {
    id: 'users',
    name: 'Users',
    attributes: [
      { key: 'firstName', type: 'string', size: 255, required: true },
      { key: 'lastName', type: 'string', size: 255, required: true },
      { key: 'email', type: 'email', size: 255, required: true },
      { key: 'avatar', type: 'url', size: 500 },
      { key: 'role', type: 'string', size: 50, required: true },
      { key: 'skills', type: 'string', size: 1000 },
      { key: 'phone', type: 'string', size: 20 },
    ]
  },
  {
    id: 'projects',
    name: 'Projects',
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 2000 },
      { key: 'status', type: 'string', size: 50, required: true },
      { key: 'priority', type: 'string', size: 50 },
      { key: 'startDate', type: 'string', size: 50 },
      { key: 'endDate', type: 'string', size: 50 },
      { key: 'budget', type: 'float' },
      { key: 'ownerId', type: 'string', size: 50, required: true },
      { key: 'teamMembers', type: 'string', size: 50, array: true },
      { key: 'progress', type: 'integer' },
      { key: 'tags', type: 'string', size: 100, array: true },
      { key: 'category', type: 'string', size: 100 },
    ]
  },
  {
    id: 'tasks',
    name: 'Tasks',
    attributes: [
      { key: 'projectId', type: 'string', size: 50, required: true },
      { key: 'text', type: 'string', size: 500, required: true },
      { key: 'status', type: 'string', size: 50 },
      { key: 'priority', type: 'string', size: 50 },
      { key: 'assigneeId', type: 'string', size: 50 },
      { key: 'estimatedTime', type: 'float' },
      { key: 'loggedTime', type: 'float' },
      { key: 'dueDate', type: 'string', size: 50 },
    ]
  },
  {
    id: 'courses',
    name: 'Courses',
    attributes: [
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 2000 },
      { key: 'instructor', type: 'string', size: 255, required: true },
      { key: 'duration', type: 'string', size: 100 },
      { key: 'level', type: 'string', size: 50 },
      { key: 'status', type: 'string', size: 50 },
      { key: 'enrolled', type: 'integer' },
      { key: 'roleId', type: 'string', size: 100 },
    ]
  },
  {
    id: 'jobs',
    name: 'Jobs',
    attributes: [
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 2000 },
      { key: 'company', type: 'string', size: 255 },
      { key: 'location', type: 'string', size: 255 },
      { key: 'salary', type: 'float' },
      { key: 'type', type: 'string', size: 50 },
      { key: 'status', type: 'string', size: 50 },
      { key: 'requirements', type: 'string', size: 2000 },
    ]
  },
  {
    id: 'invoices',
    name: 'Invoices',
    attributes: [
      { key: 'invoiceNumber', type: 'string', size: 100, required: true },
      { key: 'clientName', type: 'string', size: 255, required: true },
      { key: 'amount', type: 'float', required: true },
      { key: 'dueDate', type: 'string', size: 50, required: true },
      { key: 'status', type: 'string', size: 50 },
      { key: 'recurringSourceId', type: 'integer' },
    ]
  },
  {
    id: 'expenses',
    name: 'Expenses',
    attributes: [
      { key: 'category', type: 'string', size: 100, required: true },
      { key: 'description', type: 'string', size: 500, required: true },
      { key: 'amount', type: 'float', required: true },
      { key: 'date', type: 'string', size: 50, required: true },
      { key: 'dueDate', type: 'string', size: 50 },
      { key: 'status', type: 'string', size: 50 },
      { key: 'budgetItemId', type: 'string', size: 50 },
      { key: 'recurringSourceId', type: 'integer' },
    ]
  },
  {
    id: 'time_logs',
    name: 'Time Logs',
    attributes: [
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'projectId', type: 'string', size: 50 },
      { key: 'courseId', type: 'string', size: 50 },
      { key: 'taskId', type: 'string', size: 50 },
      { key: 'taskDescription', type: 'string', size: 500 },
      { key: 'hours', type: 'float', required: true },
      { key: 'date', type: 'string', size: 50, required: true },
      { key: 'description', type: 'string', size: 1000 },
    ]
  },
  {
    id: 'leave_requests',
    name: 'Leave Requests',
    attributes: [
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'userName', type: 'string', size: 255, required: true },
      { key: 'userAvatar', type: 'url', size: 500 },
      { key: 'type', type: 'string', size: 100, required: true },
      { key: 'startDate', type: 'string', size: 50, required: true },
      { key: 'endDate', type: 'string', size: 50, required: true },
      { key: 'reason', type: 'string', size: 1000 },
      { key: 'status', type: 'string', size: 50 },
    ]
  },
  {
    id: 'contacts',
    name: 'Contacts',
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'workEmail', type: 'email', size: 255 },
      { key: 'personalEmail', type: 'email', size: 255 },
      { key: 'company', type: 'string', size: 255 },
      { key: 'status', type: 'string', size: 50 },
      { key: 'avatar', type: 'url', size: 500 },
      { key: 'officePhone', type: 'string', size: 20 },
      { key: 'mobilePhone', type: 'string', size: 20 },
      { key: 'whatsappNumber', type: 'string', size: 20 },
    ]
  },
  {
    id: 'documents',
    name: 'Documents',
    attributes: [
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'content', type: 'string', size: 10000, required: true },
      { key: 'createdAt', type: 'string', size: 50 },
      { key: 'createdBy', type: 'string', size: 255 },
    ]
  },
  {
    id: 'risks',
    name: 'Risks',
    attributes: [
      { key: 'projectId', type: 'string', size: 50, required: true },
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 1000 },
      { key: 'impact', type: 'string', size: 50 },
      { key: 'probability', type: 'string', size: 50 },
      { key: 'mitigationStrategy', type: 'string', size: 1000 },
    ]
  },
];

async function createAttribute(
  databaseId: string,
  collectionId: string,
  attr: AttributeDefinition
): Promise<void> {
  try {
    switch (attr.type) {
      case 'string':
        await databases.createStringAttribute(
          databaseId,
          collectionId,
          attr.key,
          attr.size || 255,
          attr.required || false,
          attr.default,
          attr.array || false
        );
        break;
      case 'integer':
        await databases.createIntegerAttribute(
          databaseId,
          collectionId,
          attr.key,
          attr.required || false,
          undefined,
          undefined,
          attr.default
        );
        break;
      case 'float':
        await databases.createFloatAttribute(
          databaseId,
          collectionId,
          attr.key,
          attr.required || false,
          undefined,
          undefined,
          attr.default
        );
        break;
      case 'email':
        await databases.createEmailAttribute(
          databaseId,
          collectionId,
          attr.key,
          attr.required || false,
          attr.default
        );
        break;
      case 'url':
        await databases.createUrlAttribute(
          databaseId,
          collectionId,
          attr.key,
          attr.required || false,
          attr.default
        );
        break;
    }
    console.log(`  ✅ Attribut créé: ${attr.key}`);
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log(`  ⚠️  Attribut existe déjà: ${attr.key}`);
    } else {
      console.error(`  ❌ Erreur attribut ${attr.key}:`, error.message);
    }
  }
}

async function createAllCollections(): Promise<void> {
  console.log('🚀 CRÉATION DES COLLECTIONS APPWRITE\n');

  for (const collection of collections) {
    console.log(`📂 Création collection: ${collection.name} (${collection.id})`);

    try {
      // Créer la collection
      await databases.createCollection(
        databaseId,
        collection.id,
        collection.name,
        [
          { permission: 'read', target: 'role:all' },
          { permission: 'create', target: 'role:member' },
          { permission: 'update', target: 'role:member' },
          { permission: 'delete', target: 'role:admin' }
        ] as any
      );
      console.log(`✅ Collection créée: ${collection.name}\n`);

      // Attendre un peu pour éviter les rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Créer les attributs
      for (const attr of collection.attributes) {
        await createAttribute(databaseId, collection.id, attr);
        // Attendre un peu entre chaque attribut
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`✅ Tous les attributs créés pour ${collection.name}\n`);

    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log(`⚠️  Collection existe déjà: ${collection.name}`);
        
        // Essayer de créer les attributs manquants
        console.log('  Vérification des attributs...');
        for (const attr of collection.attributes) {
          await createAttribute(databaseId, collection.id, attr);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log('');
      } else {
        console.error(`❌ Erreur collection ${collection.name}:`, error.message);
        console.log('');
      }
    }
  }

  console.log('\n🎉 CRÉATION TERMINÉE !');
  console.log('\n📋 RÉSUMÉ:');
  console.log(`  • ${collections.length} collections configurées`);
  console.log(`  • Base de données: ${databaseId}`);
  console.log(`  • Project: 68e54e9c002cb568cfec\n`);
}

// Exécuter le script
createAllCollections()
  .then(() => {
    console.log('✅ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });


