"use client";

import DashboardLayout from "@/components/admin/layout/DashboardLayout";
import { Poppins } from 'next/font/google';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function Dashboard() {
  const [totalCommandes, setTotalCommandes] = useState<number>(0);
  const [totalRevenus, setTotalRevenus] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Récupérer le nombre total de commandes
        const { count: commandesCount, error: commandesError } = await supabase
          .from('commandes')
          .select('id', { count: 'exact', head: true });

        if (commandesError) throw commandesError;

        // Récupérer le total des revenus (commandes + marchés)
        const { data: commandes, error: revenusError } = await supabase
          .from('commandes')
          .select('montant_total');

        if (revenusError) throw revenusError;

        const { data: ventesMarche, error: ventesError } = await supabase
          .from('vente_marche')
          .select('montant_total');

        if (ventesError) throw ventesError;

        // Calculer le total des revenus
        const revenusCommandes = commandes?.reduce((sum, cmd) => sum + parseFloat(cmd.montant_total.toString()), 0) || 0;
        const revenusMarches = ventesMarche?.reduce((sum, vente) => sum + parseFloat(vente.montant_total.toString()), 0) || 0;
        
        setTotalCommandes(commandesCount || 0);
        setTotalRevenus(revenusCommandes + revenusMarches);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      {/* Statistiques principales - optimisées pour mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 text-black">
        {/* Commandes */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900 text-sm font-medium">Commandes</h3>
            <div className="bg-purple-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded mt-2"></div>
          ) : (
            <p className="text-2xl font-semibold mt-2">{totalCommandes}</p>
          )}
        </div>

        {/* Revenus */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="9 text-sm font-medium">Revenus</h3>
            <div className="bg-green-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded mt-2"></div>
          ) : (
            <p className="text-2xl font-semibold mt-2">{totalRevenus.toFixed(2)} €</p>
          )}
        </div>
      </div>

      {/* Guide d'utilisation */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-medium mb-4">Guide d'utilisation de l'administration</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-[#A90BD9] mb-2">Bienvenue dans votre tableau de bord Odyssée Sucrée</h3>
            <p className="text-gray-600 mb-3">
              Cette interface vous permet de gérer l'ensemble de votre activité. Voici comment naviguer et utiliser les différentes fonctionnalités :
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="border-l-4 border-[#A90BD9] pl-4">
              <h4 className="font-medium">Gestion des clients</h4>
              <p className="text-gray-600 text-sm">
                Dans la section <strong>Clients</strong>, vous pouvez consulter votre fichier client, ajouter de nouveaux clients, 
                modifier leurs informations et suivre leur historique d'achat. Un outil précieux pour fidéliser votre clientèle.
              </p>
            </div>
            
            <div className="border-l-4 border-[#A90BD9] pl-4">
              <h4 className="font-medium">Gestion des marchés</h4>
              <p className="text-gray-600 text-sm">
                La section <strong>Marchés</strong> vous permet de planifier vos événements, enregistrer vos ventes en temps réel 
                grâce au TPE intégré, et consulter les statistiques détaillées de chaque marché (produits vendus, chiffre d'affaires, etc.).
              </p>
            </div>
            
            <div className="border-l-4 border-[#A90BD9] pl-4">
              <h4 className="font-medium">Gestion des stocks</h4>
              <p className="text-gray-600 text-sm">
                Suivez votre inventaire dans la section <strong>Stocks</strong>. Vous pouvez ajouter de nouveaux produits, 
                mettre à jour les quantités et recevoir des alertes lorsque les stocks sont bas.
              </p>
            </div>
            
            <div className="border-l-4 border-[#A90BD9] pl-4">
              <h4 className="font-medium">Commandes et événements</h4>
              <p className="text-gray-600 text-sm">
                Gérez vos commandes clients et événements à venir dans les sections dédiées. Vous pouvez suivre l'état des commandes, 
                enregistrer les paiements et planifier vos productions.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Conseils d'utilisation</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Sur mobile, utilisez le menu en haut à gauche pour naviguer entre les sections</li>
              <li>Consultez régulièrement vos statistiques pour suivre l'évolution de votre activité</li>
              <li>Mettez à jour vos stocks après chaque marché ou production</li>
              <li>Utilisez les filtres dans chaque section pour retrouver rapidement l'information recherchée</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
