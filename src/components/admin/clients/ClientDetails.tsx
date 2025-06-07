'use client';

import { useState, useEffect } from 'react';
import { Client, Enfant, NouvelEnfant } from '@/types/database';
import EnfantModal from '@/components/admin/clients/EnfantModal';

interface ClientDetailsProps {
  clientId: string;
  onClose: () => void;
  onEdit: () => void;
}

export default function ClientDetails({ clientId, onClose, onEdit }: ClientDetailsProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnfantModalOpen, setIsEnfantModalOpen] = useState(false);

  useEffect(() => {
    async function fetchClientDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/clients/${clientId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du client');
        }
        const data = await response.json();
        setClient(data.client);
        setEnfants(data.enfants || []);
      } catch (err) {
        setError('Impossible de charger les détails du client');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (clientId) {
      fetchClientDetails();
    }
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A90BD9]"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Client non trouvé'}
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return '-';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {client.prenom} {client.nom}
          {client.vip && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              VIP
            </span>
          )}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="bg-[#A90BD9] hover:bg-[#8A09B1] text-white px-3 py-1 rounded-md flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Modifier
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md"
          >
            Fermer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <span className="text-sm text-gray-900">{client.email || '-'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Téléphone:</span>
              <span className="text-sm text-gray-900">{client.telephone || '-'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Date de naissance:</span>
              <span className="text-sm text-gray-900">{formatDate(client.date_naissance)}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Adresse:</span>
              <span className="text-sm text-gray-900">
                {client.adresse ? (
                  <>
                    {client.adresse}
                    <br />
                    {client.code_postal} {client.ville}
                    <br />
                    {client.pays}
                  </>
                ) : (
                  '-'
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques client</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Nombre de commandes:</span>
              <span className="text-sm text-gray-900">{client.nombre_commandes}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Montant total dépensé:</span>
              <span className="text-sm text-gray-900">
                {client.montant_total_depense ? `${client.montant_total_depense.toFixed(2)} €` : '-'}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Date d'inscription:</span>
              <span className="text-sm text-gray-900">{formatDate(client.date_inscription)}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Date dernière commande:</span>
              <span className="text-sm text-gray-900">{formatDate(client.date_derniere_commande)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Préférences</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Préférence de sucre:</span>
              <span className="text-sm text-gray-900">{client.preferences_sucre || '-'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Saveurs préférées:</span>
              <span className="text-sm text-gray-900">{client.preferences_saveurs || '-'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Allergies:</span>
              <span className="text-sm text-gray-900">{client.allergies || '-'}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Marketing</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Source d'acquisition:</span>
              <span className="text-sm text-gray-900">{client.source_acquisition || '-'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Newsletter:</span>
              <span className="text-sm text-gray-900">
                {client.newsletter_inscrit ? 'Inscrit' : 'Non inscrit'}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-gray-500">Avis Google:</span>
              <span className="text-sm text-gray-900">
                {client.avis_google ? 'Oui' : 'Non'}
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">
            {client.notes || 'Aucune note'}
          </p>
        </div>

        <div className="md:col-span-2 bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Enfants</h3>
            <button 
              onClick={() => setIsEnfantModalOpen(true)}
              className="text-sm text-[#A90BD9] hover:text-[#8A09B1] flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Ajouter un enfant
            </button>
          </div>
          
          {enfants.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun enfant enregistré</p>
          ) : (
            <div className="space-y-4">
              {enfants.map((enfant) => (
                <div key={enfant.id} className="border border-gray-200 rounded-md p-3 text-black">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{enfant.prenom}</h4>
                    <div className="flex space-x-2">
                      <button className="text-[#A90BD9] hover:text-[#8A09B1]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Date de naissance:</span>{' '}
                      {formatDate(enfant.date_naissance)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Allergies:</span>{' '}
                      {enfant.allergies || '-'}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-500">Préférences gâteau:</span>{' '}
                      {enfant.preferences_gateau || '-'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal pour ajouter un enfant */}
      <EnfantModal
        isOpen={isEnfantModalOpen}
        onClose={() => setIsEnfantModalOpen(false)}
        onSubmit={handleAddEnfant}
        clientId={clientId}
        title="Ajouter un enfant"
      />
    </div>
  );

  async function handleAddEnfant(enfant: NouvelEnfant) {
    try {
      const response = await fetch(`/api/clients/${clientId}/enfants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enfant),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'enfant');
      }

      const newEnfant = await response.json();
      setEnfants(prev => [...prev, newEnfant]);
      return newEnfant;
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'enfant:', err);
      throw err;
    }
  }
}
