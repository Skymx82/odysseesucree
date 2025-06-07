'use client';

import { useState } from 'react';
import { NouveauClient } from '@/types/database';

interface ClientFormProps {
  onSubmit: (client: NouveauClient) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<NouveauClient>;
  isEditing?: boolean;
}

export default function ClientForm({ onSubmit, onCancel, initialData = {}, isEditing = false }: ClientFormProps) {
  const [formData, setFormData] = useState<Partial<NouveauClient>>({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    date_naissance: '',
    adresse: '',
    code_postal: '',
    ville: '',
    pays: 'France',
    avis_google: false,
    newsletter_inscrit: false,
    source_acquisition: '',
    allergies: '',
    preferences_sucre: '',
    preferences_saveurs: '',
    notes: '',
    vip: false,
    actif: true,
    ...initialData
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData as NouveauClient);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'enregistrement du client');
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

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
              Prénom *
            </label>
            <input
              type="text"
              name="prenom"
              id="prenom"
              required
              value={formData.prenom || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
              Nom *
            </label>
            <input
              type="text"
              name="nom"
              id="nom"
              required
              value={formData.nom || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              id="telephone"
              value={formData.telephone || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
          <div>
            <label htmlFor="date_naissance" className="block text-sm font-medium text-gray-700">
              Date de naissance
            </label>
            <input
              type="date"
              name="date_naissance"
              id="date_naissance"
              value={formData.date_naissance || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <input
              type="text"
              name="adresse"
              id="adresse"
              value={formData.adresse || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
          <div>
            <label htmlFor="code_postal" className="block text-sm font-medium text-gray-700">
              Code postal
            </label>
            <input
              type="text"
              name="code_postal"
              id="code_postal"
              value={formData.code_postal || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
          <div>
            <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
              Ville
            </label>
            <input
              type="text"
              name="ville"
              id="ville"
              value={formData.ville || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
          <div>
            <label htmlFor="pays" className="block text-sm font-medium text-gray-700">
              Pays
            </label>
            <input
              type="text"
              name="pays"
              id="pays"
              value={formData.pays || 'France'}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Préférences et informations marketing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="source_acquisition" className="block text-sm font-medium text-gray-700">
              Source d'acquisition
            </label>
            <select
              name="source_acquisition"
              id="source_acquisition"
              value={formData.source_acquisition || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            >
              <option value="">Sélectionner</option>
              <option value="Bouche à oreille">Bouche à oreille</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Google">Google</option>
              <option value="Événement">Événement</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label htmlFor="preferences_sucre" className="block text-sm font-medium text-gray-700">
              Préférence de sucre
            </label>
            <select
              name="preferences_sucre"
              id="preferences_sucre"
              value={formData.preferences_sucre || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            >
              <option value="">Sélectionner</option>
              <option value="peu sucré">Peu sucré</option>
              <option value="normal">Normal</option>
              <option value="très sucré">Très sucré</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="preferences_saveurs" className="block text-sm font-medium text-gray-700">
              Saveurs préférées
            </label>
            <input
              type="text"
              name="preferences_saveurs"
              id="preferences_saveurs"
              placeholder="ex: chocolat, fraise, vanille"
              value={formData.preferences_saveurs || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
              Allergies
            </label>
            <textarea
              name="allergies"
              id="allergies"
              rows={2}
              value={formData.allergies || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            ></textarea>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="avis_google"
              id="avis_google"
              checked={formData.avis_google || false}
              onChange={handleChange}
              className="h-4 w-4 text-[#A90BD9] focus:ring-[#A90BD9] border-gray-300 rounded"
            />
            <label htmlFor="avis_google" className="ml-2 block text-sm text-gray-700">
              A laissé un avis Google
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="newsletter_inscrit"
              id="newsletter_inscrit"
              checked={formData.newsletter_inscrit || false}
              onChange={handleChange}
              className="h-4 w-4 text-[#A90BD9] focus:ring-[#A90BD9] border-gray-300 rounded"
            />
            <label htmlFor="newsletter_inscrit" className="ml-2 block text-sm text-gray-700">
              Inscrit à la newsletter
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notes et statut</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              value={formData.notes || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            ></textarea>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="vip"
              id="vip"
              checked={formData.vip || false}
              onChange={handleChange}
              className="h-4 w-4 text-[#A90BD9] focus:ring-[#A90BD9] border-gray-300 rounded"
            />
            <label htmlFor="vip" className="ml-2 block text-sm text-gray-700">
              Client VIP
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="actif"
              id="actif"
              checked={formData.actif !== false}
              onChange={handleChange}
              className="h-4 w-4 text-[#A90BD9] focus:ring-[#A90BD9] border-gray-300 rounded"
            />
            <label htmlFor="actif" className="ml-2 block text-sm text-gray-700">
              Client actif
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A90BD9]"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#A90BD9] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-[#8A09B1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A90BD9] disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer le client'}
        </button>
      </div>
    </form>
  );
}
