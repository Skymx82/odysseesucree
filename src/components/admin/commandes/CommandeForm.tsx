'use client';

import { useState, useEffect } from 'react';
import { Commande, StatutCommande, StatutPaiement, TypeCommande, Client } from '@/types/database';

interface CommandeFormProps {
  onSubmit: (commande: any) => Promise<void>;
  initialData?: Partial<Commande>;
  isEditing?: boolean;
  onCancel: () => void;
}

export default function CommandeForm({
  onSubmit,
  initialData,
  isEditing = false,
  onCancel
}: CommandeFormProps) {
  const [formData, setFormData] = useState<Partial<Commande>>({
    id_client: '',
    date_commande: new Date().toISOString().split('T')[0],
    date_livraison: '',
    statut: 'en attente' as StatutCommande,
    montant_total: 0,
    type_commande: 'commande standard' as TypeCommande,
    evenement_type: '',
    evenement_nombre_personnes: null,
    adresse_livraison: '',
    code_postal_livraison: '',
    ville_livraison: '',
    methode_paiement: '',
    statut_paiement: 'en attente' as StatutPaiement,
    acompte_paye: 0,
    instructions_speciales: '',
    notes_internes: '',
    ...initialData
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  // Charger la liste des clients pour le sélecteur
  useEffect(() => {
    async function fetchClients() {
      try {
        setLoadingClients(true);
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des clients');
        }
        const data = await response.json();
        // Vérifier la structure de la réponse et extraire le tableau de clients
        if (data.clients && Array.isArray(data.clients)) {
          setClients(data.clients);
        } else if (Array.isArray(data)) {
          setClients(data);
        } else {
          console.error('Format de réponse clients inattendu:', data);
          setClients([]);
        }
      } catch (err) {
        console.error('Impossible de charger les clients', err);
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    }

    fetchClients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Conversion des valeurs numériques
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? null : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value === '' ? null : value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'enregistrement de la commande');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sélection du client */}
          <div>
            <label htmlFor="id_client" className="block text-sm font-medium text-gray-700">
              Client *
            </label>
            <select
              id="id_client"
              name="id_client"
              required
              value={formData.id_client || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
              disabled={loadingClients}
            >
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.nom} {client.prenom}
                </option>
              ))}
            </select>
            {loadingClients && (
              <p className="text-xs text-gray-500 mt-1">Chargement des clients...</p>
            )}
          </div>
          
          {/* Type de commande */}
          <div>
            <label htmlFor="type_commande" className="block text-sm font-medium text-gray-700">
              Type de commande *
            </label>
            <select
              id="type_commande"
              name="type_commande"
              required
              value={formData.type_commande || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            >
              <option value="commande standard">Commande standard</option>
              <option value="événement">Commande événement</option>
            </select>
          </div>
          
          {/* Date de commande */}
          <div>
            <label htmlFor="date_commande" className="block text-sm font-medium text-gray-700">
              Date de commande *
            </label>
            <input
              type="date"
              id="date_commande"
              name="date_commande"
              required
              value={formData.date_commande || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>

          {/* Date de livraison */}
          <div>
            <label htmlFor="date_livraison" className="block text-sm font-medium text-gray-700">
              Date de livraison
            </label>
            <input
              type="date"
              id="date_livraison"
              name="date_livraison"
              value={formData.date_livraison || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
        </div>
      </div>

      {/* Informations événement (conditionnelles) */}
      {formData.type_commande === 'événement' && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations événement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="evenement_type" className="block text-sm font-medium text-gray-700">
                Type d'événement
              </label>
              <input
                type="text"
                id="evenement_type"
                name="evenement_type"
                value={formData.evenement_type || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
                placeholder="Mariage, anniversaire, etc."
              />
            </div>

            <div>
              <label htmlFor="evenement_nombre_personnes" className="block text-sm font-medium text-gray-700">
                Nombre de personnes
              </label>
              <input
                type="number"
                id="evenement_nombre_personnes"
                name="evenement_nombre_personnes"
                value={formData.evenement_nombre_personnes || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
                min="1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Adresse de livraison */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse de livraison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label htmlFor="adresse_livraison" className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <input
              type="text"
              id="adresse_livraison"
              name="adresse_livraison"
              value={formData.adresse_livraison || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
              placeholder="Numéro et nom de rue"
            />
          </div>

          <div>
            <label htmlFor="code_postal_livraison" className="block text-sm font-medium text-gray-700">
              Code postal
            </label>
            <input
              type="text"
              id="code_postal_livraison"
              name="code_postal_livraison"
              value={formData.code_postal_livraison || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="ville_livraison" className="block text-sm font-medium text-gray-700">
              Ville
            </label>
            <input
              type="text"
              id="ville_livraison"
              name="ville_livraison"
              value={formData.ville_livraison || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
        </div>
      </div>

      {/* Informations de paiement */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de paiement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="montant_total" className="block text-sm font-medium text-gray-700">
              Montant total (€) *
            </label>
            <input
              type="number"
              id="montant_total"
              name="montant_total"
              required
              value={formData.montant_total || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="acompte_paye" className="block text-sm font-medium text-gray-700">
              Acompte payé (€)
            </label>
            <input
              type="number"
              id="acompte_paye"
              name="acompte_paye"
              value={formData.acompte_paye || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="methode_paiement" className="block text-sm font-medium text-gray-700">
              Méthode de paiement
            </label>
            <select
              id="methode_paiement"
              name="methode_paiement"
              value={formData.methode_paiement || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            >
              <option value="">Sélectionner</option>
              <option value="carte">Carte bancaire</option>
              <option value="espèces">Espèces</option>
              <option value="virement">Virement</option>
              <option value="chèque">Chèque</option>
            </select>
          </div>

          <div>
            <label htmlFor="statut_paiement" className="block text-sm font-medium text-gray-700">
              Statut du paiement *
            </label>
            <select
              id="statut_paiement"
              name="statut_paiement"
              required
              value={formData.statut_paiement || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            >
              <option value="en attente">En attente</option>
              <option value="partiel">Partiel</option>
              <option value="complet">Complet</option>
              <option value="remboursé">Remboursé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statut de la commande */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Statut de la commande</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
              Statut *
            </label>
            <select
              id="statut"
              name="statut"
              required
              value={formData.statut || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            >
              <option value="en attente">En attente</option>
              <option value="confirmée">Confirmée</option>
              <option value="en préparation">En préparation</option>
              <option value="prête">Prête</option>
              <option value="livrée">Livrée</option>
              <option value="annulée">Annulée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes et instructions */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notes et instructions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="instructions_speciales" className="block text-sm font-medium text-gray-700">
              Instructions spéciales
            </label>
            <textarea
              id="instructions_speciales"
              name="instructions_speciales"
              rows={3}
              value={formData.instructions_speciales || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
              placeholder="Instructions spéciales pour la commande..."
            />
          </div>

          <div>
            <label htmlFor="notes_internes" className="block text-sm font-medium text-gray-700">
              Notes internes
            </label>
            <textarea
              id="notes_internes"
              name="notes_internes"
              rows={3}
              value={formData.notes_internes || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
              placeholder="Notes internes (non visibles par le client)..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#A90BD9] text-white rounded-md hover:bg-[#8A09B1] disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer la commande'}
        </button>
      </div>
    </form>
  );
}
