// Types TypeScript pour la base de données Odyssée Sucrée
// Ces types correspondent au schéma SQL défini dans supabase/schema.sql

export type Client = {
  id: string; // UUID
  prenom: string;
  nom: string;
  email: string | null;
  telephone: string | null;
  date_naissance: string | null; // Format ISO date "YYYY-MM-DD"
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  pays: string;
  
  // Préférences et informations marketing
  avis_google: boolean;
  newsletter_inscrit: boolean;
  source_acquisition: string | null;
  
  // Statistiques
  nombre_commandes: number;
  montant_total_depense: number;
  
  // Préférences culinaires
  allergies: string | null;
  preferences_sucre: string | null; // "peu sucré", "normal", "très sucré"
  preferences_saveurs: string | null;
  
  // Dates importantes
  date_derniere_commande: string | null; // Format ISO date "YYYY-MM-DD"
  date_inscription: string; // Format ISO datetime
  date_derniere_modification: string; // Format ISO datetime
  
  // Notes et commentaires
  notes: string | null;
  
  // Champs pour la gestion interne
  vip: boolean;
  actif: boolean;
};

export type Enfant = {
  id: string; // UUID
  id_client: string; // UUID référence à clients.id
  prenom: string;
  date_naissance: string | null; // Format ISO date "YYYY-MM-DD"
  allergies: string | null;
  preferences_gateau: string | null;
  notes: string | null;
};

export type StatutCommande = 
  | 'en attente'
  | 'confirmée'
  | 'en préparation'
  | 'prête'
  | 'livrée'
  | 'annulée';

export type TypeCommande = 
  | 'événement'
  | 'anniversaire'
  | 'commande standard';

export type StatutPaiement = 
  | 'en attente'
  | 'partiel'
  | 'complet'
  | 'remboursé';

export type Commande = {
  id: string; // UUID
  id_client: string; // UUID référence à clients.id
  date_commande: string; // Format ISO datetime
  date_livraison: string | null; // Format ISO datetime
  statut: StatutCommande;
  montant_total: number;
  type_commande: TypeCommande;
  
  // Informations sur l'événement si applicable
  evenement_type: string | null; // mariage, anniversaire, baptême, etc.
  evenement_nombre_personnes: number | null;
  
  // Adresse de livraison (si différente de l'adresse du client)
  adresse_livraison: string | null;
  code_postal_livraison: string | null;
  ville_livraison: string | null;
  
  // Informations de paiement
  methode_paiement: string | null;
  statut_paiement: StatutPaiement;
  acompte_paye: number;
  
  // Notes et commentaires
  instructions_speciales: string | null;
  notes_internes: string | null;
};

export type ProduitCommande = {
  id: string; // UUID
  id_commande: string; // UUID référence à commandes.id
  nom_produit: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  personnalisation: string | null;
  allergenes: string | null;
};

export type TypeEvenement = 
  | 'anniversaire'
  | 'fête'
  | 'autre';

export type Evenement = {
  id: string; // UUID
  id_client: string | null; // UUID référence à clients.id
  id_enfant: string | null; // UUID référence à enfants.id
  type: TypeEvenement;
  date: string; // Format ISO date "YYYY-MM-DD"
  rappel_envoye: boolean;
  date_rappel: string | null; // Format ISO date "YYYY-MM-DD"
  notes: string | null;
};

export type TypeCommunication = 
  | 'email'
  | 'SMS'
  | 'appel téléphonique';

export type StatutCommunication = 
  | 'envoyé'
  | 'ouvert'
  | 'cliqué'
  | 'répondu';

export type Communication = {
  id: string; // UUID
  id_client: string; // UUID référence à clients.id
  date_envoi: string; // Format ISO datetime
  type: TypeCommunication;
  sujet: string | null;
  contenu: string | null;
  statut: StatutCommunication;
  reponse: string | null;
};

// Type pour les données de base d'un nouveau client (lors de la création)
export type NouveauClient = Omit<Client, 
  'id' | 
  'nombre_commandes' | 
  'montant_total_depense' | 
  'date_derniere_commande' | 
  'date_inscription' | 
  'date_derniere_modification'
>;

// Type pour les données de base d'un nouvel enfant (lors de la création)
export type NouvelEnfant = Omit<Enfant, 'id'>;

// Type pour les données de base d'une nouvelle commande (lors de la création)
export type NouvelleCommande = Omit<Commande, 'id' | 'date_commande'>;

// Type pour les données de base d'un nouveau produit de commande (lors de la création)
export type NouveauProduitCommande = Omit<ProduitCommande, 'id'>;

// Type pour les données de base d'un nouvel événement (lors de la création)
export type NouvelEvenement = Omit<Evenement, 'id' | 'rappel_envoye'>;

// Type pour les données de base d'une nouvelle communication (lors de la création)
export type NouvelleCommunication = Omit<Communication, 'id' | 'date_envoi'>;
