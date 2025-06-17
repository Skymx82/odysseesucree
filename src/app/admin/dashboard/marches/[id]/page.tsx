"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/layout/DashboardLayout';
import { Marche, ElementStock, VenteMarche, NouvelleVenteMarche, NouvelleVarianteMarche, VarianteMarche } from '@/types/database';
import { supabase } from '@/utils/supabase';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

type ProduitSelectionne = {
  id: string;
  nom: string;
  quantite: number;
  prix_unitaire: number;
};

type VenteAvecVariantes = VenteMarche & {
  variante_marche: VarianteMarche[];
};

export default function MarchePage() {
  const params = useParams();
  const router = useRouter();
  const marcheId = params.id as string;
  
  const [marche, setMarche] = useState<Marche | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour l'interface TPE
  const [etape, setEtape] = useState<'montant' | 'produits' | 'confirmation'>('montant');
  const [montantVente, setMontantVente] = useState<string>('');
  const [stockItems, setStockItems] = useState<ElementStock[]>([]);
  const [produitsSelectionnes, setProduitsSelectionnes] = useState<{
    id: string;
    nom: string;
    quantite: number;
    prix_unitaire: number;
  }[]>([]);
  const [quantiteTemp, setQuantiteTemp] = useState<{[key: string]: number}>({});
  const [ventes, setVentes] = useState<VenteAvecVariantes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusVente, setStatusVente] = useState<'déclarée' | 'non_déclarée'>('déclarée');
  
  // Récupérer les informations du marché
  const fetchMarche = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marches')
        .select('*')
        .eq('id', marcheId)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        throw new Error('Marché non trouvé');
      }
      
      setMarche(data as Marche);
    } catch (err: any) {
      console.error('Erreur lors du chargement du marché:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };
  
  // Récupérer les éléments du stock
  const fetchStock = async () => {
    try {
      const { data, error } = await supabase
        .from('stock')
        .select('*')
        .order('nom');
      
      if (error) throw error;
      
      setStockItems(data || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement du stock:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement du stock');
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialiser la quantité temporaire pour un produit
  const initQuantiteTemp = (produitId: string) => {
    if (!quantiteTemp[produitId]) {
      setQuantiteTemp(prev => ({
        ...prev,
        [produitId]: 1
      }));
    }
  };
  
  // Gérer le changement de quantité temporaire
  const handleChangeQuantiteTemp = (produitId: string, delta: number) => {
    setQuantiteTemp(prev => {
      const nouvelleQuantite = Math.max(1, (prev[produitId] || 1) + delta);
      return {
        ...prev,
        [produitId]: nouvelleQuantite
      };
    });
  };
  
  // Gérer l'ajout d'un produit à la vente
  const handleAjoutProduit = (produit: ElementStock) => {
    // Récupérer la quantité sélectionnée
    const quantite = quantiteTemp[produit.id] || 1;
    
    // Vérifier si le produit existe déjà dans la liste
    const index = produitsSelectionnes.findIndex(p => p.id === produit.id);
    
    if (index !== -1) {
      // Mettre à jour la quantité si le produit existe déjà
      const nouveauxProduits = [...produitsSelectionnes];
      nouveauxProduits[index].quantite += quantite;
      setProduitsSelectionnes(nouveauxProduits);
    } else {
      // Ajouter le produit s'il n'existe pas encore
      setProduitsSelectionnes([
        ...produitsSelectionnes,
        {
          id: produit.id,
          nom: produit.nom,
          quantite: quantite,
          prix_unitaire: produit.prix_par_part || 0
        }
      ]);
    }
    
    // Ne pas réinitialiser la quantité temporaire pour conserver la valeur sélectionnée
  };
  
  // Supprimer un produit de la liste
  const handleSupprimerProduit = (id: string) => {
    setProduitsSelectionnes(produitsSelectionnes.filter(p => p.id !== id));
  };
  
  // Modifier la quantité d'un produit déjà sélectionné
  const handleModifierQuantiteProduit = (id: string, delta: number) => {
    const index = produitsSelectionnes.findIndex(p => p.id === id);
    if (index !== -1) {
      const nouveauxProduits = [...produitsSelectionnes];
      const nouvelleQuantite = Math.max(1, nouveauxProduits[index].quantite + delta);
      
      if (nouvelleQuantite === 0) {
        // Si la quantité atteint 0, supprimer le produit
        handleSupprimerProduit(id);
      } else {
        // Sinon, mettre à jour la quantité
        nouveauxProduits[index].quantite = nouvelleQuantite;
        setProduitsSelectionnes(nouveauxProduits);
      }
    }
  };
  
  // Enregistrer la vente
  const handleEnregistrerVente = async (status: 'déclarée' | 'non_déclarée') => {
    try {
      // Convertir le montant en nombre
      const montant = parseFloat(montantVente);
      
      // Vérifier que le montant est valide
      if (isNaN(montant) || montant <= 0) {
        setError('Veuillez entrer un montant valide');
        return;
      }
      
      // Vérifier qu'au moins un produit est sélectionné
      if (produitsSelectionnes.length === 0) {
        setError('Veuillez sélectionner au moins un produit');
        return;
      }
      
      // Créer la vente avec le statut choisi
      const nouvelleVente: NouvelleVenteMarche = {
        id_marche: marcheId,
        date_vente: new Date().toISOString(),
        montant_total: montant,
        notes: null,
        status: status
      };
      
      const { data: venteData, error: venteError } = await supabase
        .from('vente_marche')
        .insert([nouvelleVente])
        .select();
      
      if (venteError) throw venteError;
      
      if (!venteData || venteData.length === 0) {
        throw new Error('Erreur lors de la création de la vente');
      }
      
      const venteId = venteData[0].id;
      
      // Créer les variantes de produits
      const variantes: NouvelleVarianteMarche[] = produitsSelectionnes.map(produit => ({
        id_vente_marche: venteId,
        id_stock: produit.id,
        nom_produit: produit.nom,
        quantite: produit.quantite,
        prix_unitaire: produit.prix_unitaire,
        montant_total: produit.quantite * produit.prix_unitaire
      }));
      
      const { error: variantesError } = await supabase
        .from('variante_marche')
        .insert(variantes);
      
      if (variantesError) throw variantesError;
      
      // Mettre à jour le stock pour chaque produit vendu
      for (const produit of produitsSelectionnes) {
        if (produit.id) {
          // Récupérer d'abord l'élément du stock actuel
          const { data: stockData, error: stockError } = await supabase
            .from('stock')
            .select('quantite')
            .eq('id', produit.id)
            .single();
          
          if (stockError) {
            console.error(`Erreur lors de la récupération du stock pour ${produit.nom}:`, stockError);
            continue;
          }
          
          if (stockData) {
            // Calculer la nouvelle quantité
            const nouvelleQuantite = Math.max(0, stockData.quantite - produit.quantite);
            
            // Mettre à jour le stock
            const { error: updateError } = await supabase
              .from('stock')
              .update({ quantite: nouvelleQuantite })
              .eq('id', produit.id);
            
            if (updateError) {
              console.error(`Erreur lors de la mise à jour du stock pour ${produit.nom}:`, updateError);
            }
          }
        }
      }
      
      // Rafraîchir la liste des ventes
      await fetchVentes();
      
      // Réinitialiser le formulaire
      setMontantVente('');
      setProduitsSelectionnes([]);
      setEtape('montant');
      
    } catch (err: any) {
      console.error('Erreur lors de l\'enregistrement de la vente:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'enregistrement de la vente');
    }
  };
  
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };
  
  useEffect(() => {
    fetchMarche();
    fetchStock();
    fetchVentes();
  }, [marcheId]);
  
  // Rendu de l'interface TPE pour la saisie du montant
  const renderEtapeMontant = () => (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center mb-6">Nouvelle vente</h2>
      
      <div className="mb-6">
        <div className="bg-gray-100 p-4 rounded-lg text-right mb-2">
          <span className="text-2xl font-mono">{montantVente || '0.00'} €</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map((touche) => (
            <button
              key={touche}
              className={`py-3 text-xl rounded-md ${
                touche === '⌫' 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => {
                if (touche === '⌫') {
                  setMontantVente(prev => prev.slice(0, -1));
                } else if (touche === '.' && montantVente.includes('.')) {
                  // Ne pas ajouter un second point
                  return;
                } else {
                  setMontantVente(prev => {
                    const newValue = prev + touche;
                    // Limiter à 2 décimales si un point est présent
                    if (newValue.includes('.')) {
                      const [entier, decimal] = newValue.split('.');
                      if (decimal && decimal.length > 2) {
                        return entier + '.' + decimal.slice(0, 2);
                      }
                    }
                    return newValue;
                  });
                }
              }}
            >
              {touche}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => router.push('/admin/dashboard/marches')}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          onClick={() => {
            if (!montantVente || parseFloat(montantVente) <= 0) {
              setError('Veuillez entrer un montant valide');
              return;
            }
            setError(null);
            setEtape('produits');
          }}
          className="px-4 py-2 bg-[#A90BD9] text-white rounded-md hover:bg-[#8A09B1]"
        >
          Suivant
        </button>
      </div>
    </div>
  );
  
  // Rendu de l'interface de sélection des produits
  const renderEtapeProduits = () => (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">Sélectionner les produits vendus</h2>
      <p className="text-center text-gray-600 mb-6">Montant total: <span className="font-semibold">{parseFloat(montantVente).toFixed(2)} €</span></p>
      
      {/* Compteur de produits sélectionnés */}
      {produitsSelectionnes.length > 0 && (
        <div className="mb-4 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#A90BD9] bg-opacity-10 text-black">
            {produitsSelectionnes.length} {produitsSelectionnes.length > 1 ? 'produits sélectionnés' : 'produit sélectionné'}
          </span>
        </div>
      )}
      
      {/* Liste des produits du stock */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Produits disponibles:</h3>
        <div className="max-h-60 overflow-y-auto">
          {stockItems.map((item) => {
            // Initialiser la quantité temporaire si nécessaire
            if (!quantiteTemp[item.id]) {
              initQuantiteTemp(item.id);
            }
            
            // Vérifier si le produit est déjà sélectionné
            const produitSelectionne = produitsSelectionnes.find(p => p.id === item.id);
            
            return (
              <div 
                key={item.id} 
                className={`flex justify-between items-center py-2 border-b border-gray-200 ${produitSelectionne ? 'bg-[#A90BD9] bg-opacity-5' : ''}`}
              >
                <div className="flex-grow">
                  <span className="font-medium">{item.nom}</span>
                  {produitSelectionne && (
                    <span className="ml-2 text-sm text-[#A90BD9] font-medium">
                      {produitSelectionne.quantite} sélectionné(s)
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {produitSelectionne ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center border rounded-md bg-white">
                        <button
                          onClick={() => handleModifierQuantiteProduit(item.id, -1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2 min-w-[30px] text-center">
                          {produitSelectionne.quantite}
                        </span>
                        <button
                          onClick={() => handleModifierQuantiteProduit(item.id, 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleSupprimerProduit(item.id)}
                        className="text-red-500 hover:text-red-700 rounded-full w-8 h-8 flex items-center justify-center"
                        aria-label="Supprimer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => handleChangeQuantiteTemp(item.id, -1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          disabled={quantiteTemp[item.id] <= 1}
                        >
                          -
                        </button>
                        <span className="px-2 min-w-[30px] text-center">
                          {quantiteTemp[item.id] || 1}
                        </span>
                        <button
                          onClick={() => handleChangeQuantiteTemp(item.id, 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleAjoutProduit(item)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center ml-1"
                      >
                        +
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <button
            onClick={() => setEtape('montant')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Retour
          </button>
        </div>
        
        <div className="flex justify-between space-x-2">
          <button
            onClick={() => handleEnregistrerVente('déclarée')}
            className="flex-1 px-4 py-3 bg-[#A90BD9] text-white rounded-md hover:bg-[#8A09B1]"
            disabled={produitsSelectionnes.length === 0}
          >
            Vente déclarée
          </button>
          <button
            onClick={() => handleEnregistrerVente('non_déclarée')}
            className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900"
            disabled={produitsSelectionnes.length === 0}
          >
            Vente au black
          </button>
        </div>
      </div>
    </div>
  );
  
  // Rendu de la liste des ventes
  const renderListeVentes = () => {
    if (isLoading) {
      return <div className="text-center py-4">Chargement des ventes...</div>;
    }
    
    if (ventes.length === 0) {
      return <div className="text-center py-4 text-gray-500">Aucune vente enregistrée pour ce marché</div>;
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4">Ventes réalisées</h2>
        
        <div>
          {ventes.map((vente) => (
            <div key={vente.id} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium">{format(new Date(vente.date_vente), 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
                  <span className="ml-2 text-[#A90BD9] font-semibold">{parseFloat(vente.montant_total.toString()).toFixed(2)} €</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${vente.status === 'déclarée' ? 'bg-green-100 text-green-800' : 'bg-gray-800 text-white'}`}>
                  {vente.status === 'déclarée' ? 'Déclarée' : 'Au black'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                {vente.variante_marche.map((variante) => (
                  <div key={variante.id} className="flex justify-between">
                    <span>{variante.nom_produit}</span>
                    <span>x{variante.quantite}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between font-semibold">
            <span>Total des ventes:</span>
            <span>{ventes.reduce((total, vente) => total + parseFloat(vente.montant_total.toString()), 0).toFixed(2)} €</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-4 pb-24 max-w-lg mx-auto text-black min-h-screen">
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
          <h1 className="text-xl font-semibold text-gray-800">
            {loading ? 'Chargement...' : marche ? marche.nom : 'Marché non trouvé'}
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
          <>
            {/* Interface TPE */}
            {etape === 'montant' ? renderEtapeMontant() : renderEtapeProduits()}
            
            {/* Liste des ventes */}
            {renderListeVentes()}
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>Marché non trouvé</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
