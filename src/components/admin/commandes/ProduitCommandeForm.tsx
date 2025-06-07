'use client';

import { useState } from 'react';
import { ProduitCommande } from '@/types/database';

interface ProduitCommandeFormProps {
  commandeId: string;
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: Partial<ProduitCommande>;
  isEditing?: boolean;
}

export default function ProduitCommandeForm({
  commandeId,
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}: ProduitCommandeFormProps) {
  const [formData, setFormData] = useState<Partial<ProduitCommande>>({
    id_commande: commandeId,
    nom_produit: '',
    description: '',
    quantite: 1,
    prix_unitaire: 0,
    ...initialData
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const url = isEditing 
        ? `/api/commandes/${commandeId}/produits/${initialData?.id}`
        : `/api/commandes/${commandeId}/produits`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Une erreur est survenue');
      }

      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="nom_produit" className="block text-sm font-medium text-gray-700">
          Nom du produit *
        </label>
        <input
          type="text"
          id="nom_produit"
          name="nom_produit"
          required
          value={formData.nom_produit || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          value={formData.description || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantite" className="block text-sm font-medium text-gray-700">
            Quantité *
          </label>
          <input
            type="number"
            id="quantite"
            name="quantite"
            required
            min="1"
            value={formData.quantite || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
          />
        </div>

        <div>
          <label htmlFor="prix_unitaire" className="block text-sm font-medium text-gray-700">
            Prix unitaire (€) *
          </label>
          <input
            type="number"
            id="prix_unitaire"
            name="prix_unitaire"
            required
            min="0"
            step="0.01"
            value={formData.prix_unitaire || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
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
          {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}
