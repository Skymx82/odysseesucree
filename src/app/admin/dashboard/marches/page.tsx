"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/layout/DashboardLayout';
import { Marche, StatutMarche, NouveauMarche } from '@/types/database';
import { supabase } from '@/utils/supabase';
import { Poppins } from 'next/font/google';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function MarchesPage() {
  const [marches, setMarches] = useState<Marche[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStatut, setSelectedStatut] = useState<StatutMarche | 'tous'>('tous');
  const [newMarche, setNewMarche] = useState<{
    nom: string;
    lieu: string;
    date: string;
  }>({
    nom: '',
    lieu: '',
    date: new Date().toISOString().split('T')[0],
  });
  
  // Récupérer les marchés depuis Supabase
  const fetchMarches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marches')
        .select('*');
      
      if (error) throw error;
      
      // Trier les marchés par proximité de date avec aujourd'hui
      const today = new Date();
      const sortedData = (data || []).sort((a, b) => {
        const dateA = new Date(a.date_debut);
        const dateB = new Date(b.date_debut);
        
        // Calculer la différence absolue en millisecondes entre chaque date et aujourd'hui
        const diffA = Math.abs(dateA.getTime() - today.getTime());
        const diffB = Math.abs(dateB.getTime() - today.getTime());
        
        // Trier par proximité (la plus petite différence en premier)
        return diffA - diffB;
      });
      
      setMarches(sortedData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des marchés:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };
  
  // Ajouter un nouveau marché
  const handleAddMarche = async () => {
    try {
      if (!newMarche.nom || !newMarche.lieu || !newMarche.date) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      const dateObj = new Date(newMarche.date);
      
      const { data, error } = await supabase
        .from('marches')
        .insert([{
          nom: newMarche.nom,
          lieu: newMarche.lieu,
          date_debut: dateObj.toISOString(),
          date_fin: dateObj.toISOString(),
          statut: 'à venir',
          notes: null,
          produits_vendus: null,
          chiffre_affaire: null
        }])
        .select();
      
      if (error) throw error;
      
      // Rafraîchir la liste et fermer le modal
      fetchMarches();
      setIsAddModalOpen(false);
      setNewMarche({
        nom: '',
        lieu: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'ajout');
    }
  };
  
  // Filtrer les marchés par statut
  const filteredMarches = selectedStatut === 'tous' 
    ? marches 
    : marches.filter(marche => marche.statut === selectedStatut);
  
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };
  
  useEffect(() => {
    fetchMarches();
  }, []);
  
  return (
    <DashboardLayout>
      <div className="p-4 pb-24 max-w-lg mx-auto text-black">
        {/* En-tête avec titre et bouton d'ajout */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Marchés</h1>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#A90BD9] text-white p-2 rounded-full shadow-sm"
            aria-label="Ajouter un marché"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        
        {/* Filtres par statut - Optimisés pour mobile */}
        <div className="mb-4 flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <button 
            onClick={() => setSelectedStatut('tous')}
            className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap text-sm ${
              selectedStatut === 'tous' 
                ? 'bg-[#A90BD9] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Tous les marchés
          </button>
          <button 
            onClick={() => setSelectedStatut('à venir')}
            className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap text-sm ${
              selectedStatut === 'à venir' 
                ? 'bg-[#A90BD9] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            À venir
          </button>
          <button 
            onClick={() => setSelectedStatut('en cours')}
            className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap text-sm ${
              selectedStatut === 'en cours' 
                ? 'bg-[#A90BD9] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            En cours
          </button>
          <button 
            onClick={() => setSelectedStatut('terminé')}
            className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap text-sm ${
              selectedStatut === 'terminé' 
                ? 'bg-[#A90BD9] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Terminés
          </button>
          <button 
            onClick={() => setSelectedStatut('annulé')}
            className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap text-sm ${
              selectedStatut === 'annulé' 
                ? 'bg-[#A90BD9] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Annulés
          </button>
        </div>
        
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="float-right"
              aria-label="Fermer"
            >
              &times;
            </button>
          </div>
        )}
        
        {/* Indicateur de chargement */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#A90BD9]"></div>
          </div>
        ) : (
          <>
            {/* Liste des marchés */}
            {filteredMarches.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-3 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
                <p>Aucun marché trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredMarches.map(marche => (
                  <div 
                    key={marche.id} 
                    className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      window.location.href = `/admin/dashboard/marches/${marche.id}`;
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="font-medium text-lg text-gray-800">{marche.nom}</h2>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        marche.statut === 'à venir' ? 'bg-blue-100 text-blue-800' :
                        marche.statut === 'en cours' ? 'bg-green-100 text-green-800' :
                        marche.statut === 'terminé' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {marche.statut}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {marche.lieu}
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(marche.date_debut)} - {formatDate(marche.date_fin)}
                    </p>
                    
                    {marche.chiffre_affaire !== null && (
                      <p className="text-sm font-medium text-gray-700">
                        Chiffre d'affaires: {marche.chiffre_affaire.toFixed(2)}€
                      </p>
                    )}
                    
                    <div className="mt-3 flex justify-end">
                      <button 
                        className="text-[#A90BD9] text-sm font-medium"
                        onClick={(e) => {
                          // Empêcher la propagation du clic pour éviter que le clic sur le bouton
                          // ne déclenche également le clic sur la carte
                          e.stopPropagation();
                          // Rediriger vers la page de détails du marché
                          window.location.href = `/admin/dashboard/marches/${marche.id}/details`;
                        }}
                      >
                        Voir détails →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Modal d'ajout de marché */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Ajouter un marché</h2>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du marché *
                  </label>
                  <input
                    id="nom"
                    type="text"
                    value={newMarche.nom}
                    onChange={(e) => setNewMarche({...newMarche, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A90BD9]"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="lieu" className="block text-sm font-medium text-gray-700 mb-1">
                    Lieu *
                  </label>
                  <input
                    id="lieu"
                    type="text"
                    value={newMarche.lieu}
                    onChange={(e) => setNewMarche({...newMarche, lieu: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A90BD9]"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={newMarche.date}
                    onChange={(e) => setNewMarche({...newMarche, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A90BD9]"
                    required
                  />
                </div>
              </div>
              
              <div className="p-4 border-t flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddMarche}
                  className="px-4 py-2 bg-[#A90BD9] text-white rounded-md hover:bg-[#8A09B1]"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
