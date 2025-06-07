-- Schema pour la base de données Odyssée Sucrée
-- Compatible avec Supabase (PostgreSQL)

-- Table des clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telephone VARCHAR(20),
    date_naissance DATE,
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    pays VARCHAR(100) DEFAULT 'France',
    
    -- Préférences et informations marketing
    avis_google BOOLEAN DEFAULT FALSE,
    newsletter_inscrit BOOLEAN DEFAULT FALSE,
    source_acquisition VARCHAR(100), -- Comment le client a connu la pâtisserie
    
    -- Statistiques
    nombre_commandes INTEGER DEFAULT 0,
    montant_total_depense DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Préférences culinaires
    allergies TEXT,
    preferences_sucre VARCHAR(50), -- "peu sucré", "normal", "très sucré"
    preferences_saveurs TEXT, -- Saveurs préférées (chocolat, fraise, etc.)
    
    -- Dates importantes
    date_derniere_commande DATE,
    date_inscription TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_derniere_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Notes et commentaires
    notes TEXT,
    
    -- Champs pour la gestion interne
    vip BOOLEAN DEFAULT FALSE,
    actif BOOLEAN DEFAULT TRUE
);

-- Table des enfants des clients
CREATE TABLE enfants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_client UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    allergies TEXT,
    preferences_gateau TEXT,
    notes TEXT
);

-- Table des commandes
CREATE TABLE commandes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_client UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    date_commande TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_livraison TIMESTAMP WITH TIME ZONE,
    statut VARCHAR(50) DEFAULT 'en attente', -- en attente, confirmée, en préparation, prête, livrée, annulée
    montant_total DECIMAL(10, 2) NOT NULL,
    type_commande VARCHAR(50) NOT NULL, -- événement, anniversaire, commande standard
    
    -- Informations sur l'événement si applicable
    evenement_type VARCHAR(100), -- mariage, anniversaire, baptême, etc.
    evenement_nombre_personnes INTEGER,
    
    -- Adresse de livraison (si différente de l'adresse du client)
    adresse_livraison TEXT,
    code_postal_livraison VARCHAR(10),
    ville_livraison VARCHAR(100),
    
    -- Informations de paiement
    methode_paiement VARCHAR(50),
    statut_paiement VARCHAR(50) DEFAULT 'en attente', -- en attente, partiel, complet, remboursé
    acompte_paye DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Notes et commentaires
    instructions_speciales TEXT,
    notes_internes TEXT
);

-- Table des événements importants (anniversaires, fêtes, etc.)
CREATE TABLE evenements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_client UUID REFERENCES clients(id) ON DELETE SET NULL,
    id_enfant UUID REFERENCES enfants(id) ON DELETE SET NULL,
    type VARCHAR(100) NOT NULL, -- anniversaire, fête, etc.
    date DATE NOT NULL,
    rappel_envoye BOOLEAN DEFAULT FALSE,
    date_rappel DATE, -- Date à laquelle envoyer un rappel
    notes TEXT
);

-- Table des communications avec les clients
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_client UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    date_envoi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type VARCHAR(50) NOT NULL, -- email, SMS, appel téléphonique
    sujet VARCHAR(255),
    contenu TEXT,
    statut VARCHAR(50) DEFAULT 'envoyé', -- envoyé, ouvert, cliqué, répondu
    reponse TEXT
);

-- Table des produits de commande
CREATE TABLE produits_commandes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_commande UUID NOT NULL REFERENCES commandes(id) ON DELETE CASCADE,
    nom_produit VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    quantite INTEGER NOT NULL DEFAULT 1,
    prix_unitaire DECIMAL(10, 2) NOT NULL,
    personnalisation TEXT,
    allergenes TEXT
);