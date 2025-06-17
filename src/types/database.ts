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

// Types pour la gestion des stocks
export type TypeFrigo = 
  | 'Frigo 1'
  | 'Frigo 2'
  | 'Frigo 3';

export type ElementStock = {
  id: string; // UUID
  nom: string;
  quantite: number;
  unite: string; // g, kg, l, ml, pièce, etc.
  frigo: TypeFrigo;
  prix_par_part: number | null; // Prix par part en euros
  date_peremption: string | null; // Format ISO date "YYYY-MM-DD"
  date_ajout: string; // Format ISO datetime
  date_modification: string; // Format ISO datetime
  notes: string | null;
  alerte_stock_bas: number | null; // Seuil d'alerte pour stock bas
};

// Type pour les données de base d'un nouvel élément de stock (lors de la création)
export type NouvelElementStock = Omit<ElementStock, 
  'id' | 
  'date_ajout' | 
  'date_modification'
>;

// Types pour la gestion des marchés
export type StatutMarche = 
  | 'à venir'
  | 'en cours'
  | 'terminé'
  | 'annulé';

export type Marche = {
  id: string; // UUID
  nom: string;
  lieu: string;
  date_debut: string; // Format ISO datetime
  date_fin: string; // Format ISO datetime
  statut: StatutMarche;
  notes: string | null;
  produits_vendus: string | null; // Liste des produits vendus au format JSON
  chiffre_affaire: number | null; // Chiffre d'affaires réalisé
  date_creation: string; // Format ISO datetime
  date_modification: string; // Format ISO datetime
};

// Type pour les données de base d'un nouveau marché (lors de la création)
export type NouveauMarche = Omit<Marche, 
  'id' | 
  'statut' | 
  'chiffre_affaire' | 
  'date_creation' | 
  'date_modification'
>;

// Type pour les ventes sur les marchés
export type VenteMarche = {
  id: string; // UUID
  id_marche: string; // UUID
  date_vente: string; // Format ISO datetime
  montant_total: number;
  notes: string | null;
  status: 'déclarée' | 'non_déclarée';
  date_creation: string; // Format ISO datetime
  date_modification: string; // Format ISO datetime
};

// Type pour les variantes de produits vendus sur les marchés
export type VarianteMarche = {
  id: string; // UUID
  id_vente_marche: string; // UUID
  id_stock: string | null; // UUID
  nom_produit: string;
  quantite: number;
  prix_unitaire: number;
  montant_total: number;
  date_creation: string; // Format ISO datetime
  date_modification: string; // Format ISO datetime
};

// Types pour la création
export type NouvelleVenteMarche = Omit<VenteMarche,
  'id' |
  'date_creation' |
  'date_modification'
>;

export type NouvelleVarianteMarche = Omit<VarianteMarche,
  'id' |
  'date_creation' |
  'date_modification'
>;
