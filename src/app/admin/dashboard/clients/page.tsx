'use client';

import { useState, useEffect } from 'react';
import { Client, NouveauClient } from '@/types/database';
import DashboardLayout from '@/components/admin/layout/DashboardLayout';
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
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Fichier Clients</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#A90BD9] hover:bg-[#8A09B1] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
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
          // Vue adaptative : tableau pour desktop, cartes pour mobile
          <div className="w-full">
            {/* Vue desktop - tableau (caché sur mobile) */}
            <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anniversaire</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                        Aucun client trouvé
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
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
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {client.email || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {client.telephone || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {client.date_naissance ? new Date(client.date_naissance).toLocaleDateString('fr-FR') : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {client.nombre_commandes}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
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
            
            {/* Vue mobile - cartes (visible uniquement sur mobile) */}
            <div className="md:hidden space-y-3">
              {clients.length === 0 ? (
                <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
                  Aucun client trouvé
                </div>
              ) : (
                clients.map((client) => (
                  <div key={client.id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{client.prenom} {client.nom}</h3>
                        {client.ville && <p className="text-xs text-gray-500">{client.ville}</p>}
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {client.nombre_commandes} cmd
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-3 text-sm">
                      {client.email && (
                        <div className="flex items-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      
                      {client.telephone && (
                        <div className="flex items-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{client.telephone}</span>
                        </div>
                      )}
                      
                      {client.date_naissance && (
                        <div className="flex items-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(client.date_naissance).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between border-t pt-3">
                      <button 
                        onClick={() => handleViewClient(client)}
                        className="text-[#A90BD9] text-sm font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Détails
                      </button>
                      <button 
                        onClick={() => handleEditClient(client)}
                        className="text-gray-600 text-sm font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white rounded-lg shadow-xl w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto">
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

