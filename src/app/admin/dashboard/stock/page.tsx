"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/layout/DashboardLayout';
import { ElementStock, TypeFrigo } from '@/types/database';
import { supabase } from '@/utils/supabase';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function StockPage() {
  const [stockItems, setStockItems] = useState<ElementStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFrigo, setSelectedFrigo] = useState<TypeFrigo | 'tous'>('tous');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    nom: '',
    quantite: 1,
    unite: 'pièce',
    frigo: 'Frigo 1' as TypeFrigo,
    prix_par_part: null as number | null,
    notes: ''
  });
  
  // Récupérer les éléments de stock depuis Supabase
  const fetchStock = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stock')
        .select('*')
        .order('frigo')
        .order('nom');
      
      if (error) throw error;
      
      setStockItems(data || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement du stock:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };
  
  // Ajouter un nouvel élément au stock
  const handleAddItem = async () => {
    try {
      if (!newItem.nom || newItem.quantite < 0) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      const { data, error } = await supabase
        .from('stock')
        .insert([{
          nom: newItem.nom,
          quantite: newItem.quantite,
          unite: newItem.unite,
          frigo: newItem.frigo,
          prix_par_part: newItem.prix_par_part,
          notes: newItem.notes || null
        }])
        .select();
      
      if (error) throw error;
      
      // Rafraîchir la liste et fermer le modal
      fetchStock();
      setIsAddModalOpen(false);
      setNewItem({
        nom: '',
        quantite: 1,
        unite: 'pièce',
        frigo: 'Frigo 1' as TypeFrigo,
        prix_par_part: null,
        notes: ''
      });
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'ajout');
    }
  };
  
  // Mettre à jour la quantité d'un élément
  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) return;
      
      const { error } = await supabase
        .from('stock')
        .update({ 
          quantite: newQuantity,
          date_modification: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      setStockItems(stockItems.map(item => 
        item.id === id ? { ...item, quantite: newQuantity } : item
      ));
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour');
    }
  };
  
  // Supprimer un élément du stock
  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stock')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      setStockItems(stockItems.filter(item => item.id !== id));
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      setError(err.message || 'Une erreur est survenue lors de la suppression');
    }
  };
  
  // Filtrer les éléments par frigo
  const filteredItems = selectedFrigo === 'tous' 
    ? stockItems 
    : stockItems.filter(item => item.frigo === selectedFrigo);
  
  // Grouper les éléments par frigo pour l'affichage
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.frigo]) {
      acc[item.frigo] = [];
    }
    acc[item.frigo].push(item);
    return acc;
  }, {} as Record<string, ElementStock[]>);
  
  useEffect(() => {
    fetchStock();
  }, []);
  
  return (
    <DashboardLayout>
      <div className="p-4 max-w-lg mx-auto text-black">
        {/* En-tête avec titre et bouton d'ajout */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Stock des Frigos</h1>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#A90BD9] text-white p-2 rounded-full shadow-sm"
            aria-label="Ajouter un produit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        
        {/* Filtres par frigo - Optimisés pour mobile */}
        <div className="mb-4 flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <button 
            onClick={() => setSelectedFrigo('tous')}
            className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap text-sm ${
              selectedFrigo === 'tous' 
                ? 'bg-[#A90BD9] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Tous les frigos
          </button>
          <button 
            onClick={() => setSelectedFrigo('Frigo 1')}
            className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap text-sm ${
              selectedFrigo === 'Frigo 1' 
                ? 'bg-[#A90BD9] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Frigo 1
          </button>
          <button 
            onClick={() => setSelectedFrigo('Frigo 2')}
            className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap text-sm ${
              selectedFrigo === 'Frigo 2' 
                ? 'bg-[#A90BD9] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Frigo 2
          </button>
          <button 
            onClick={() => setSelectedFrigo('Frigo 3')}
            className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap text-sm ${
              selectedFrigo === 'Frigo 3' 
                ? 'bg-[#A90BD9] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Frigo 3
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
            {/* Liste des produits par frigo */}
            {Object.keys(groupedItems).length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-3 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
                </svg>
                <p>Aucun produit trouvé</p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([frigo, items]) => (
                <div key={frigo} className="mb-6">
                  {selectedFrigo === 'tous' && (
                    <h2 className="text-lg font-medium text-gray-700 mb-2 border-b pb-1">
                      {frigo}
                    </h2>
                  )}
                  
                  <ul className="space-y-2">
                    {items.map(item => (
                      <li 
                        key={item.id} 
                        className="bg-white rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-2"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.nom}</p>
                          {item.prix_par_part !== null && item.prix_par_part !== undefined && (
                            <p className="text-xs text-gray-500">Prix par part: {item.prix_par_part.toFixed(2)}€</p>
                          )}
                        </div>
                        
                        {/* Contrôles de quantité - Optimisés pour mobile */}
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantite - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                            disabled={item.quantite <= 0}
                            aria-label="Diminuer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                            </svg>
                          </button>
                          
                          <span className="mx-2 w-8 text-center font-medium">
                            {item.quantite}
                          </span>
                          
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantite + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                            aria-label="Augmenter"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </button>
                          
                          <span className="ml-1 text-xs text-gray-500">
                            {item.unite}
                          </span>
                          
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="ml-3 text-red-500 p-1"
                            aria-label="Supprimer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </>
        )}
        
        {/* Modal d'ajout de produit */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Ajouter un produit</h2>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit *
                  </label>
                  <input
                    id="nom"
                    type="text"
                    value={newItem.nom}
                    onChange={(e) => setNewItem({...newItem, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A90BD9]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="quantite" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité *
                    </label>
                    <input
                      id="quantite"
                      type="number"
                      min="0"
                      value={newItem.quantite}
                      onChange={(e) => setNewItem({...newItem, quantite: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A90BD9]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="unite" className="block text-sm font-medium text-gray-700 mb-1">
                      Unité
                    </label>
                    <select
                      id="unite"
                      value={newItem.unite}
                      onChange={(e) => setNewItem({...newItem, unite: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A90BD9]"
                    >
                      <option value="pièce">pièce</option>
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="l">l</option>
                      <option value="boîte">boîte</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="frigo" className="block text-sm font-medium text-gray-700 mb-1">
                    Frigo *
                  </label>
                  <select
                    id="frigo"
                    value={newItem.frigo}
                    onChange={(e) => setNewItem({...newItem, frigo: e.target.value as TypeFrigo})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A90BD9]"
                    required
                  >
                    <option value="Frigo 1">Frigo 1</option>
                    <option value="Frigo 2">Frigo 2</option>
                    <option value="Frigo 3">Frigo 3</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="prix_par_part" className="block text-sm font-medium text-gray-700 mb-1">
                    Prix par part (€)
                  </label>
                  <input
                    id="prix_par_part"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItem.prix_par_part !== null ? newItem.prix_par_part : ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : parseFloat(e.target.value);
                      setNewItem({...newItem, prix_par_part: value});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A90BD9]"
                    placeholder="Optionnel"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={newItem.notes}
                    onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A90BD9]"
                    rows={2}
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
                  onClick={handleAddItem}
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
