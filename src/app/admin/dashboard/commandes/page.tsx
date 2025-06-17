'use client';

import DashboardLayout from '@/components/admin/layout/DashboardLayout';
import CommandeModal from '@/components/admin/commandes/CommandeModal';
import CommandeDetails from '@/components/admin/commandes/CommandeDetails';

import { useState, useEffect, useRef } from 'react';
import { Commande, StatutCommande, StatutPaiement, TypeCommande } from '@/types/database';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les filtres
  const [filtreStatut, setFiltreStatut] = useState<StatutCommande | 'tous'>('tous');
  const [filtreStatutPaiement, setFiltreStatutPaiement] = useState<StatutPaiement | 'tous'>('tous');
  const [filtreType, setFiltreType] = useState<TypeCommande | 'tous'>('tous');
  const [recherche, setRecherche] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // États pour la pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const commandesParPage = 6; // Réduit pour mobile

  // État pour la commande sélectionnée
  const [commandeSelectionnee, setCommandeSelectionnee] = useState<Commande | null>(null);
  const [showCommandeDetails, setShowCommandeDetails] = useState(false);

  // États pour les modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Référence pour le scroll
  const topRef = useRef<HTMLDivElement>(null);

  // Fonction pour récupérer les commandes
  async function fetchCommandes() {
    try {
      setLoading(true);
      const response = await fetch('/api/commandes');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }
      const data = await response.json();
      
      // Tri des commandes par proximité de date avec aujourd'hui
      const today = new Date();
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.date_commande);
        const dateB = new Date(b.date_commande);
        
        // Calculer la différence absolue en millisecondes entre chaque date et aujourd'hui
        const diffA = Math.abs(dateA.getTime() - today.getTime());
        const diffB = Math.abs(dateB.getTime() - today.getTime());
        
        // Trier par proximité (la plus petite différence en premier)
        return diffA - diffB;
      });
      
      setCommandes(sortedData);
      setTotalPages(Math.ceil(sortedData.length / commandesParPage));
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

  // Scroll vers le haut lors du changement de page
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [page]);

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
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return '-';
    }
  };

  // Fonction pour formater le montant
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(montant);
  };

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatutColor = (statut: StatutCommande) => {
    switch (statut) {
      case 'en attente': return 'bg-yellow-100 text-yellow-800';
      case 'confirmée': return 'bg-blue-100 text-blue-800';
      case 'en préparation': return 'bg-purple-100 text-purple-800';
      case 'prête': return 'bg-green-100 text-green-800';
      case 'livrée': return 'bg-gray-100 text-gray-800';
      case 'annulée': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Fonction pour obtenir la couleur du badge selon le statut de paiement
  const getStatutPaiementColor = (statut: StatutPaiement) => {
    switch (statut) {
      case 'en attente': return 'bg-yellow-100 text-yellow-800';
      case 'partiel': return 'bg-blue-100 text-blue-800';
      case 'complet': return 'bg-green-100 text-green-800';
      case 'remboursé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

      // Rafraîchir la liste des commandes
      fetchCommandes();
      setIsEditModalOpen(false);
    } catch (err) {
      setError('Impossible de mettre à jour la commande');
      console.error(err);
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

      // Rafraîchir la liste des commandes
      fetchCommandes();
      setIsModalOpen(false);
    } catch (err) {
      setError('Impossible de créer la commande');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFiltreStatut('tous');
    setFiltreStatutPaiement('tous');
    setFiltreType('tous');
    setRecherche('');
    setShowFilters(false);
  };

return (
  <DashboardLayout>
    <div className="p-4 text-black" ref={topRef}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-xl font-semibold">Gestion des Commandes</h1>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 focus:outline-none"
            aria-label="Filtres"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
          </button>
          
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Rechercher..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#A90BD9] focus:border-[#A90BD9]"
            />
            {recherche && (
              <button
                onClick={() => setRecherche('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <button
            onClick={handleCreateCommande}
            className="flex items-center justify-center p-2 bg-[#A90BD9] rounded-full text-white hover:bg-[#8A09B1] focus:outline-none"
            aria-label="Nouvelle commande"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Section des filtres - visible seulement quand showFilters est true */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Filtres</h2>
            <button 
              onClick={resetFilters}
              className="text-sm text-[#A90BD9] hover:text-[#8A09B1] flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Réinitialiser
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="filtreStatut" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                id="filtreStatut"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value as StatutCommande | 'tous')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9] text-sm"
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9] text-sm"
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#A90BD9] focus:ring-[#A90BD9] text-sm"
              >
                <option value="tous">Tous</option>
                <option value="événement">Événement</option>
                <option value="anniversaire">Anniversaire</option>
                <option value="commande standard">Commande standard</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Liste des commandes en cartes (optimisé pour mobile) */}
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
        <div className="flex flex-col">
          {/* Liste des commandes en cartes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {commandesPaginees.map((commande) => (
              <div 
                key={commande.id} 
                className="bg-white rounded-lg shadow p-4 relative hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col">
                  {/* En-tête de la carte */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-semibold">
                        Client {commande.id_client.substring(0, 8)}...
                      </h3>
                      <p className="text-xs text-gray-500">{formatDate(commande.date_commande)}</p>
                    </div>
                    <span className="font-semibold text-sm">{commande.montant_total.toFixed(2)} €</span>
                  </div>
                  
                  {/* Badges de statut */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(commande.statut)}`}>
                      {commande.statut}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatutPaiementColor(commande.statut_paiement)}`}>
                      {commande.statut_paiement}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {commande.type_commande}
                    </span>
                  </div>
                  
                  {/* Pied de carte avec ID et actions */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500 font-medium">
                      ID: {commande.id.substring(0, 8)}...
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewCommande(commande)}
                        className="p-2 text-gray-600 hover:text-[#A90BD9] rounded-full hover:bg-gray-100"
                        aria-label="Voir détails"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEditCommande(commande)}
                        className="p-2 text-gray-600 hover:text-[#A90BD9] rounded-full hover:bg-gray-100"
                        aria-label="Modifier"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
