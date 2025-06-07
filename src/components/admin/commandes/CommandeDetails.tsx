'use client';

import { useState, useEffect } from 'react';
import { Commande, Client, ProduitCommande } from '@/types/database';

interface CommandeDetailsProps {
  commandeId: string;
  onClose: () => void;
  onEdit: (commande: Commande) => void;
}

export default function CommandeDetails({ commandeId, onClose, onEdit }: CommandeDetailsProps) {
  const [commande, setCommande] = useState<Commande | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [produits, setProduits] = useState<ProduitCommande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommandeDetails() {
      try {
        setLoading(true);
        
        // Récupérer les détails de la commande
        const commandeResponse = await fetch(`/api/commandes/${commandeId}`);
        if (!commandeResponse.ok) {
          throw new Error('Erreur lors de la récupération des détails de la commande');
        }
        const commandeData = await commandeResponse.json();
        setCommande(commandeData);
        
        // Récupérer les détails du client
        if (commandeData.id_client) {
          const clientResponse = await fetch(`/api/clients/${commandeData.id_client}`);
          if (clientResponse.ok) {
            const clientData = await clientResponse.json();
            setClient(clientData);
          }
        }
        
        // Récupérer les produits de la commande
        const produitsResponse = await fetch(`/api/commandes/${commandeId}/produits`);
        if (produitsResponse.ok) {
          const produitsData = await produitsResponse.json();
          setProduits(produitsData);
        }
      } catch (err) {
        setError('Impossible de charger les détails de la commande');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (commandeId) {
      fetchCommandeDetails();
    }
  }, [commandeId]);

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto text-black">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A90BD9]"></div>
        </div>
      </div>
    );
  }

  if (error || !commande) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto text-black">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Commande non trouvée'}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto text-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Détails de la commande</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(commande)}
            className="px-4 py-2 bg-[#A90BD9] text-white rounded-md hover:bg-[#8A09B1] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Modifier
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations générales */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Informations générales</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">ID:</span>
              <span className="font-medium">{commande.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date de commande:</span>
              <span className="font-medium">{formatDate(commande.date_commande)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date de livraison:</span>
              <span className="font-medium">{formatDate(commande.date_livraison)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type de commande:</span>
              <span className="font-medium">{commande.type_commande}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Statut:</span>
              <span className={`font-medium px-2 py-1 rounded-full text-xs
                ${commande.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${commande.statut === 'confirmée' ? 'bg-blue-100 text-blue-800' : ''}
                ${commande.statut === 'en préparation' ? 'bg-indigo-100 text-indigo-800' : ''}
                ${commande.statut === 'prête' ? 'bg-green-100 text-green-800' : ''}
                ${commande.statut === 'livrée' ? 'bg-gray-100 text-gray-800' : ''}
                ${commande.statut === 'annulée' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {commande.statut}
              </span>
            </div>
          </div>
        </div>

        {/* Informations client */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Informations client</h3>
          {client ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nom:</span>
                <span className="font-medium">{client.nom} {client.prenom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{client.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Téléphone:</span>
                <span className="font-medium">{client.telephone || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Adresse:</span>
                <span className="font-medium">{client.adresse || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Code postal:</span>
                <span className="font-medium">{client.code_postal || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ville:</span>
                <span className="font-medium">{client.ville || '-'}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Informations client non disponibles</p>
          )}
        </div>
      </div>

      {/* Détails de l'événement si applicable */}
      {commande.type_commande === 'événement' && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Détails de l'événement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Type d'événement:</span>
              <span className="font-medium">{commande.evenement_type || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre de personnes:</span>
              <span className="font-medium">{commande.evenement_nombre_personnes || '-'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Adresse de livraison */}
      {(commande.adresse_livraison || commande.code_postal_livraison || commande.ville_livraison) && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Adresse de livraison</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Adresse:</span>
              <span className="font-medium">{commande.adresse_livraison || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Code postal:</span>
              <span className="font-medium">{commande.code_postal_livraison || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ville:</span>
              <span className="font-medium">{commande.ville_livraison || '-'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Informations de paiement */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">Informations de paiement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Montant total:</span>
            <span className="font-medium">{commande.montant_total.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Acompte payé:</span>
            <span className="font-medium">{commande.acompte_paye.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Reste à payer:</span>
            <span className="font-medium">{(commande.montant_total - commande.acompte_paye).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Méthode de paiement:</span>
            <span className="font-medium">{commande.methode_paiement || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Statut du paiement:</span>
            <span className={`font-medium px-2 py-1 rounded-full text-xs
              ${commande.statut_paiement === 'en attente' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${commande.statut_paiement === 'partiel' ? 'bg-blue-100 text-blue-800' : ''}
              ${commande.statut_paiement === 'complet' ? 'bg-green-100 text-green-800' : ''}
              ${commande.statut_paiement === 'remboursé' ? 'bg-red-100 text-red-800' : ''}
            `}>
              {commande.statut_paiement}
            </span>
          </div>
        </div>
      </div>

      {/* Produits de la commande */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">Produits commandés</h3>
        {produits.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produits.map((produit) => (
                  <tr key={produit.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{produit.nom_produit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produit.quantite}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produit.prix_unitaire.toFixed(2)} €</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(produit.quantite * produit.prix_unitaire).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Aucun produit associé à cette commande</p>
        )}
      </div>

      {/* Notes et instructions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {commande.instructions_speciales && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Instructions spéciales</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{commande.instructions_speciales}</p>
          </div>
        )}
        
        {commande.notes_internes && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Notes internes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{commande.notes_internes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
