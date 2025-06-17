"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/layout/DashboardLayout';
import { supabase } from '@/utils/supabase';
import { format, parseISO, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Marche, VenteMarche, VarianteMarche } from '@/types/database';

// Type pour les ventes avec leurs variantes
type VenteAvecVariantes = VenteMarche & {
  variante_marche: VarianteMarche[];
};

// Type pour les statistiques des produits
type StatsProduit = {
  id: string;
  nom: string;
  quantite_totale: number;
  montant_total: number;
  pourcentage_ca: number;
};

export default function DetailsMarche() {
  const router = useRouter();
  const { id: marcheId } = useParams();
  
  const [marche, setMarche] = useState<Marche | null>(null);
  const [ventes, setVentes] = useState<VenteAvecVariantes[]>([]);
  const [statsProduits, setStatsProduits] = useState<StatsProduit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Statistiques calculées
  const [totalVentes, setTotalVentes] = useState(0);
  const [ventesDeclarees, setVentesDeclarees] = useState(0);
  const [ventesNonDeclarees, setVentesNonDeclarees] = useState(0);
  const [moyenneParJour, setMoyenneParJour] = useState(0);
  const [bestSellerProduit, setBestSellerProduit] = useState<StatsProduit | null>(null);
  
  // Récupérer les informations du marché
  const fetchMarche = async () => {
    try {
      const { data, error } = await supabase
        .from('marches')
        .select('*')
        .eq('id', marcheId)
        .single();
      
      if (error) throw error;
      
      setMarche(data);
    } catch (err: any) {
      console.error('Erreur lors du chargement du marché:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement du marché');
    }
  };
  
  // Récupérer les ventes du marché
  const fetchVentes = async () => {
    try {
      const { data, error } = await supabase
        .from('vente_marche')
        .select(`
          *,
          variante_marche(*)
        `)
        .eq('id_marche', marcheId)
        .order('date_vente', { ascending: false });
      
      if (error) throw error;
      
      setVentes(data as VenteAvecVariantes[] || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des ventes:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des ventes');
    }
  };
  
  // Calculer les statistiques
  const calculerStatistiques = () => {
    if (!marche || ventes.length === 0) return;
    
    // Total des ventes
    const total = ventes.reduce((sum, vente) => sum + parseFloat(vente.montant_total.toString()), 0);
    setTotalVentes(total);
    
    // Ventes déclarées vs non déclarées
    const declarees = ventes
      .filter(vente => vente.status === 'déclarée')
      .reduce((sum, vente) => sum + parseFloat(vente.montant_total.toString()), 0);
    
    const nonDeclarees = ventes
      .filter(vente => vente.status === 'non_déclarée')
      .reduce((sum, vente) => sum + parseFloat(vente.montant_total.toString()), 0);
    
    setVentesDeclarees(declarees);
    setVentesNonDeclarees(nonDeclarees);
    
    // Moyenne par jour
    const dureeMarche = differenceInDays(
      new Date(marche.date_fin),
      new Date(marche.date_debut)
    ) + 1; // +1 pour inclure le jour de début
    
    setMoyenneParJour(total / dureeMarche);
    
    // Statistiques par produit
    const produitsMap = new Map<string, StatsProduit>();
    
    ventes.forEach(vente => {
      // Calculer le montant total de la vente pour répartition proportionnelle
      const montantTotalVente = parseFloat(vente.montant_total.toString());
      const totalQuantites = vente.variante_marche.reduce((sum: number, v: VarianteMarche) => sum + v.quantite, 0);
      
      vente.variante_marche.forEach((variante: VarianteMarche) => {
        const produitId = variante.id_stock || variante.nom_produit;
        
        // Calculer le montant pour ce produit basé sur sa proportion dans la vente
        // Cela assure que la somme des montants correspond exactement au montant total de la vente
        const proportion = variante.quantite / totalQuantites;
        const montant = montantTotalVente * proportion;
        
        if (produitsMap.has(produitId)) {
          const produit = produitsMap.get(produitId)!;
          produit.quantite_totale += variante.quantite;
          produit.montant_total += montant;
        } else {
          produitsMap.set(produitId, {
            id: produitId,
            nom: variante.nom_produit,
            quantite_totale: variante.quantite,
            montant_total: montant,
            pourcentage_ca: 0 // Sera calculé après
          });
        }
      });
    });
    
    // Calculer les pourcentages et trouver le best-seller
    const produits = Array.from(produitsMap.values());
    produits.forEach(produit => {
      produit.pourcentage_ca = (produit.montant_total / total) * 100;
    });
    
    // Trier par montant total décroissant
    produits.sort((a, b) => b.montant_total - a.montant_total);
    
    setStatsProduits(produits);
    setBestSellerProduit(produits.length > 0 ? produits[0] : null);
  };
  
  // Charger les données au chargement de la page
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMarche(), fetchVentes()]);
      setLoading(false);
    };
    
    loadData();
  }, [marcheId]);
  
  // Calculer les statistiques quand les données sont chargées
  useEffect(() => {
    if (!loading && marche && ventes.length > 0) {
      calculerStatistiques();
    }
  }, [marche, ventes, loading]);
  
  // Formater les dates
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <DashboardLayout>
      <div className="p-4 max-w-5xl mx-auto text-black">
        {/* En-tête avec titre et bouton de retour */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/admin/dashboard/marches')}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            {loading ? 'Chargement...' : marche ? `Détails du marché: ${marche.nom}` : 'Marché non trouvé'}
          </h1>
          <div className="w-5"></div> {/* Élément vide pour équilibrer la mise en page */}
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
        ) : marche ? (
          <div className="space-y-8">
            {/* Informations générales du marché */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Lieu</p>
                  <p className="font-medium">{marche.lieu}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Dates</p>
                  <p className="font-medium">{formatDate(marche.date_debut)} - {formatDate(marche.date_fin)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className={`font-medium ${
                    marche.statut === 'à venir' ? 'text-blue-600' :
                    marche.statut === 'en cours' ? 'text-green-600' :
                    marche.statut === 'terminé' ? 'text-gray-600' :
                    'text-red-600'
                  }`}>
                    {marche.statut}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="font-medium">{differenceInDays(new Date(marche.date_fin), new Date(marche.date_debut)) + 1} jours</p>
                </div>
              </div>
            </div>
            
            {/* Résumé des ventes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total des ventes</h3>
                <p className="text-2xl font-bold text-[#A90BD9]">{totalVentes.toFixed(2)} €</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Ventes déclarées</h3>
                <p className="text-2xl font-bold text-green-600">{ventesDeclarees.toFixed(2)} €</p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalVentes > 0 ? ((ventesDeclarees / totalVentes) * 100).toFixed(1) : 0}% du total
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Ventes au black</h3>
                <p className="text-2xl font-bold text-gray-800">{ventesNonDeclarees.toFixed(2)} €</p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalVentes > 0 ? ((ventesNonDeclarees / totalVentes) * 100).toFixed(1) : 0}% du total
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Moyenne par jour</h3>
                <p className="text-2xl font-bold text-blue-600">{moyenneParJour.toFixed(2)} €</p>
              </div>
            </div>
            
            {/* Statistiques des produits */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Statistiques des produits</h2>
              
              {statsProduits.length > 0 ? (
                <>
                  {/* Best-seller */}
                  {bestSellerProduit && (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
                      <h3 className="text-sm font-medium text-purple-800 mb-1">Produit le plus vendu</h3>
                      <p className="text-lg font-bold">{bestSellerProduit.nom}</p>
                      <div className="flex justify-between mt-2">
                        <p className="text-sm">
                          <span className="font-medium">{bestSellerProduit.quantite_totale}</span> unités
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">{bestSellerProduit.montant_total.toFixed(2)} €</span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({bestSellerProduit.pourcentage_ca.toFixed(1)}% du CA)
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Tableau des produits */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produit
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantité
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Montant
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            % du CA
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {statsProduits.map((produit) => (
                          <tr key={produit.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{produit.nom}</div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right">
                              <div className="text-sm text-gray-900">{produit.quantite_totale}</div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right">
                              <div className="text-sm text-gray-900">{produit.montant_total.toFixed(2)} €</div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right">
                              <div className="text-sm text-gray-900">{produit.pourcentage_ca.toFixed(1)}%</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucune donnée disponible
                </div>
              )}
            </div>
            
            {/* Historique des ventes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Historique des ventes</h2>
              
              {ventes.length > 0 ? (
                <div className="space-y-4">
                  {ventes.map((vente) => (
                    <div key={vente.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-medium">{format(new Date(vente.date_vente), 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
                          <span className="ml-2 text-[#A90BD9] font-semibold">{parseFloat(vente.montant_total.toString()).toFixed(2)} €</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${vente.status === 'déclarée' ? 'bg-green-100 text-green-800' : 'bg-gray-800 text-white'}`}>
                          {vente.status === 'déclarée' ? 'Déclarée' : 'Au black'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {vente.variante_marche.map((variante: VarianteMarche) => (
                          <div key={variante.id} className="flex justify-between">
                            <span>{variante.nom_produit}</span>
                            <span>x{variante.quantite}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucune vente enregistrée pour ce marché
                </div>
              )}
            </div>
            
            {/* Boutons d'action */}
            <div className="flex justify-between">
              <button
                onClick={() => router.push(`/admin/dashboard/marches/${marcheId}`)}
                className="px-4 py-2 bg-[#A90BD9] text-white rounded-md hover:bg-[#8A09B1]"
              >
                Aller au TPE
              </button>
              
              <button
                onClick={() => router.push('/admin/dashboard/marches')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Retour à la liste
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>Marché non trouvé</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
