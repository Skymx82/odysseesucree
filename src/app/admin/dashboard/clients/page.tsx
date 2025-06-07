'use client';

import { useState, useEffect } from 'react';
import { Client, NouveauClient } from '@/types/database';
import DashboardLayout from '@/components/admin/DashboardLayout';
import ClientModal from '@/components/admin/clients/ClientModal';
import ClientDetails from '@/components/admin/clients/ClientDetails';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);

  const handleCreateClient = async (client: NouveauClient) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du client');
      }

      // Rafraîchir la liste des clients
      fetchClients();
    } catch (err) {
      console.error(err);
      setError('Impossible de créer le client');
    }
  };

  const handleUpdateClient = async (client: NouveauClient) => {
    if (!selectedClient) return;
    
    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du client');
      }

      // Rafraîchir la liste des clients
      fetchClients();
    } catch (err) {
      console.error(err);
      setError('Impossible de mettre à jour le client');
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  async function fetchClients() {
    try {
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des clients');
      }
      const data = await response.json();
      setClients(data.clients || []);
    } catch (err) {
      setError('Impossible de charger les clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Fichier Clients</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#A90BD9] hover:bg-[#8A09B1] text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nouveau Client
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A90BD9]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anniversaire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Aucun client trouvé
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {client.prenom} {client.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {client.ville || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.telephone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.date_naissance ? new Date(client.date_naissance).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {client.nombre_commandes}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewClient(client)}
                          className="text-[#A90BD9] hover:text-[#8A09B1] mr-3"
                        >
                          Voir
                        </button>
                        <button 
                          onClick={() => handleEditClient(client)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Modals */}
        <ClientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateClient}
          title="Nouveau client"
        />
        
        {selectedClient && (
          <>
            <ClientModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={handleUpdateClient}
              initialData={selectedClient}
              isEditing={true}
              title={`Modifier ${selectedClient.prenom} ${selectedClient.nom}`}
            />
            
            {showClientDetails && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <ClientDetails
                    clientId={selectedClient.id}
                    onClose={() => setShowClientDetails(false)}
                    onEdit={() => {
                      setShowClientDetails(false);
                      setIsEditModalOpen(true);
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

