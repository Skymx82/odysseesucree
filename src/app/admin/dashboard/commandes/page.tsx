'use client';

import DashboardLayout from '@/components/admin/DashboardLayout';
import CommandeModal from '@/components/admin/commandes/CommandeModal';
import CommandeDetails from '@/components/admin/commandes/CommandeDetails';

import { useState, useEffect } from 'react';
import { Commande, StatutCommande, StatutPaiement, TypeCommande } from '@/types/database';

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les filtres
  const [filtreStatut, setFiltreStatut] = useState<StatutCommande | 'tous'>('tous');
  const [filtreStatutPaiement, setFiltreStatutPaiement] = useState<StatutPaiement | 'tous'>('tous');
  const [filtreType, setFiltreType] = useState<TypeCommande | 'tous'>('tous');
  const [recherche, setRecherche] = useState('');

  // États pour la pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const commandesParPage = 10;

  // État pour la commande sélectionnée
  const [commandeSelectionnee, setCommandeSelectionnee] = useState<Commande | null>(null);
  const [showCommandeDetails, setShowCommandeDetails] = useState(false);

  // États pour les modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fonction pour récupérer les commandes
  async function fetchCommandes() {
    try {
      setLoading(true);
      const response = await fetch('/api/commandes');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }
      const data = await response.json();
      setCommandes(data);
      setTotalPages(Math.ceil(data.length / commandesParPage));
    } catch (err) {
      setError('Impossible de charger les commandes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Charger les commandes au montage du composant
  useEffect(() => {
    fetchCommandes();
  }, []);

  // Fonction pour filtrer les commandes
  const commandesFiltrees = commandes.filter(commande => {
    // Filtre par statut
    if (filtreStatut !== 'tous' && commande.statut !== filtreStatut) return false;
    
    // Filtre par statut de paiement
    if (filtreStatutPaiement !== 'tous' && commande.statut_paiement !== filtreStatutPaiement) return false;
    
    // Filtre par type de commande
    if (filtreType !== 'tous' && commande.type_commande !== filtreType) return false;
    
    // Filtre par recherche (ID ou montant)
    if (recherche) {
      const rechercheLC = recherche.toLowerCase();
      return commande.id.toLowerCase().includes(rechercheLC) || 
             commande.montant_total.toString().includes(rechercheLC);
    }
    
    return true;
  });

  // Commandes paginées
  const commandesPaginees = commandesFiltrees.slice(
    (page - 1) * commandesParPage,
    page * commandesParPage
  );

  // Fonction pour formater la date
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

  // Fonctions pour gérer les actions sur les commandes
  const handleViewCommande = (commande: Commande) => {
    setCommandeSelectionnee(commande);
    setShowCommandeDetails(true);
  };

  const handleEditCommande = (commande: Commande) => {
    setCommandeSelectionnee(commande);
    setIsEditModalOpen(true);
  };

  const handleCreateCommande = () => {
    setIsModalOpen(true);
  };

  // Fonction pour mettre à jour une commande
  const handleUpdateCommande = async (commandeData: Partial<Commande>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/commandes/${commandeData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commandeData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la commande');
      }

      // Rafraîchir les données
      await fetchCommandes();
      setIsEditModalOpen(false);
      setCommandeSelectionnee(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour de la commande');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewCommande = async (commandeData: Partial<Commande>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/commandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commandeData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }

      // Rafraîchir les données
      await fetchCommandes();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-6">Gestion des commandes</h1>
      
      {/* Section des filtres et actions */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="recherche" className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <input
              type="text"
              id="recherche"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher par ID ou montant..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="filtreStatut" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                id="filtreStatut"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value as StatutCommande | 'tous')}
                className="rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
              >
                <option value="tous">Tous</option>
                <option value="en attente">En attente</option>
                <option value="confirmée">Confirmée</option>
                <option value="en préparation">En préparation</option>
                <option value="prête">Prête</option>
                <option value="livrée">Livrée</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="filtreStatutPaiement" className="block text-sm font-medium text-gray-700 mb-1">Paiement</label>
              <select
                id="filtreStatutPaiement"
                value={filtreStatutPaiement}
                onChange={(e) => setFiltreStatutPaiement(e.target.value as StatutPaiement | 'tous')}
                className="rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
              >
                <option value="tous">Tous</option>
                <option value="en attente">En attente</option>
                <option value="partiel">Partiel</option>
                <option value="complet">Complet</option>
                <option value="remboursé">Remboursé</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="filtreType" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                id="filtreType"
                value={filtreType}
                onChange={(e) => setFiltreType(e.target.value as TypeCommande | 'tous')}
                className="rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9]"
              >
                <option value="tous">Tous</option>
                <option value="événement">Événement</option>
                <option value="anniversaire">Anniversaire</option>
                <option value="commande standard">Commande standard</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handleCreateCommande}
            className="bg-[#A90BD9] hover:bg-[#8A09B1] text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nouvelle commande
          </button>
        </div>
      </div>
      
      {/* Tableau des commandes */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A90BD9]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : commandesFiltrees.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">Aucune commande ne correspond à vos critères de recherche.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commandesPaginees.map((commande) => (
                  <tr key={commande.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {commande.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(commande.date_commande)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* Ici, nous aurons besoin de récupérer le nom du client */}
                      Client {commande.id_client.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {commande.type_commande}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {commande.montant_total.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${commande.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${commande.statut === 'confirmée' ? 'bg-blue-100 text-blue-800' : ''}
                        ${commande.statut === 'en préparation' ? 'bg-indigo-100 text-indigo-800' : ''}
                        ${commande.statut === 'prête' ? 'bg-green-100 text-green-800' : ''}
                        ${commande.statut === 'livrée' ? 'bg-gray-100 text-gray-800' : ''}
                        ${commande.statut === 'annulée' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {commande.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${commande.statut_paiement === 'en attente' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${commande.statut_paiement === 'partiel' ? 'bg-blue-100 text-blue-800' : ''}
                        ${commande.statut_paiement === 'complet' ? 'bg-green-100 text-green-800' : ''}
                        ${commande.statut_paiement === 'remboursé' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {commande.statut_paiement}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewCommande(commande)}
                          className="text-[#A90BD9] hover:text-[#8A09B1]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditCommande(commande)}
                          className="text-[#A90BD9] hover:text-[#8A09B1]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                  disabled={page === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{(page - 1) * commandesParPage + 1}</span> à{' '}
                    <span className="font-medium">
                      {Math.min(page * commandesParPage, commandesFiltrees.length)}
                    </span>{' '}
                    sur <span className="font-medium">{commandesFiltrees.length}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPage(page > 1 ? page - 1 : 1)}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Précédent</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium 
                          ${page === i + 1
                            ? 'z-10 bg-[#A90BD9] border-[#A90BD9] text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Suivant</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Modal pour créer une nouvelle commande */}
      {isModalOpen && (
        <CommandeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateNewCommande}
          title="Créer une nouvelle commande"
        />
      )}

      {/* Modal pour éditer une commande existante */}
      {isEditModalOpen && commandeSelectionnee && (
        <CommandeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateCommande}
          initialData={commandeSelectionnee}
          isEditing={true}
          title="Modifier la commande"
        />
      )}

      {/* Affichage des détails d'une commande */}
      {showCommandeDetails && commandeSelectionnee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto p-4">
            <CommandeDetails
              commandeId={commandeSelectionnee.id}
              onClose={() => setShowCommandeDetails(false)}
              onEdit={handleEditCommande}
            />
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}
