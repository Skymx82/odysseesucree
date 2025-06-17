-- Ajouter une colonne status à la table vente_marche
ALTER TABLE vente_marche ADD COLUMN status TEXT DEFAULT 'déclarée' CHECK (status IN ('déclarée', 'non_déclarée'));

-- Mettre à jour les ventes existantes avec le statut par défaut
UPDATE vente_marche SET status = 'déclarée' WHERE status IS NULL;

-- Ajouter un commentaire à la colonne
COMMENT ON COLUMN vente_marche.status IS 'Statut de la vente: déclarée ou non_déclarée';
