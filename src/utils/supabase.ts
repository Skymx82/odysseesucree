import { createClient } from '@supabase/supabase-js';

// Ces variables d'environnement devront être définies dans un fichier .env.local
// Pour le développement local et dans les variables d'environnement du déploiement pour la production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction pour récupérer des données depuis une table
export async function fetchFromTable(tableName: string, options = {}) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*', options);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données de ${tableName}:`, error);
    return [];
  }
}

// Fonction pour insérer des données dans une table
export async function insertIntoTable(tableName: string, data: any) {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Erreur lors de l'insertion dans ${tableName}:`, error);
    return null;
  }
}

// Fonction pour mettre à jour des données dans une table
export async function updateInTable(tableName: string, id: number, data: any) {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour dans ${tableName}:`, error);
    return null;
  }
}

// Fonction pour supprimer des données d'une table
export async function deleteFromTable(tableName: string, id: number) {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression dans ${tableName}:`, error);
    return false;
  }
}
