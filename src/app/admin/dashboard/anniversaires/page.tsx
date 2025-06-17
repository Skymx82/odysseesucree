"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/layout/DashboardLayout';
import { Client, Enfant } from '@/types/database';
import { supabase } from '@/utils/supabase';
import { format, parseISO, isValid, addDays, isSameDay, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

// Type pour représenter un anniversaire (client ou enfant)
type Anniversaire = {
  id: string;
  prenom: string;
  nom: string;
  date_naissance: string;
  telephone: string | null;
  type: 'client' | 'enfant';
  parent_id?: string;
  parent_nom?: string;
  parent_prenom?: string;
  parent_telephone?: string;
  jours_restants: number;
};

export default function AnniversairesPage() {
  const [anniversaires, setAnniversaires] = useState<Anniversaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les anniversaires
  const fetchAnniversaires = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les clients avec date de naissance
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .not('date_naissance', 'is', null);
      
      if (clientsError) throw clientsError;
      
      // Récupérer tous les enfants avec date de naissance
      const { data: enfants, error: enfantsError } = await supabase
        .from('enfants')
        .select('*, clients!inner(id, prenom, nom, telephone)')
        .not('date_naissance', 'is', null);
      
      if (enfantsError) throw enfantsError;
      
      // Date actuelle
      const today = new Date();
      const maxDate = addDays(today, 30); // 30 jours à partir d'aujourd'hui
      
      // Traiter les anniversaires des clients
      const clientsAnniversaires = (clients || [])
        .filter(client => client.date_naissance && isValid(parseISO(client.date_naissance)))
        .map(client => {
          const dateNaissance = parseISO(client.date_naissance!);
          const anniversaireDate = new Date(today.getFullYear(), dateNaissance.getMonth(), dateNaissance.getDate());
          
          // Si l'anniversaire est déjà passé cette année, on prend celui de l'année prochaine
          if (anniversaireDate < today) {
            anniversaireDate.setFullYear(today.getFullYear() + 1);
          }
          
          const joursRestants = differenceInDays(anniversaireDate, today);
          
          return {
            id: client.id,
            prenom: client.prenom,
            nom: client.nom,
            date_naissance: client.date_naissance!,
            telephone: client.telephone,
            type: 'client' as const,
            jours_restants: joursRestants
          };
        })
        .filter(anniv => anniv.jours_restants <= 30); // Filtrer pour les 30 prochains jours
      
      // Traiter les anniversaires des enfants
      const enfantsAnniversaires = (enfants || [])
        .filter(enfant => enfant.date_naissance && isValid(parseISO(enfant.date_naissance)))
        .map(enfant => {
          const dateNaissance = parseISO(enfant.date_naissance!);
          const anniversaireDate = new Date(today.getFullYear(), dateNaissance.getMonth(), dateNaissance.getDate());
          
          // Si l'anniversaire est déjà passé cette année, on prend celui de l'année prochaine
          if (anniversaireDate < today) {
            anniversaireDate.setFullYear(today.getFullYear() + 1);
          }
          
          const joursRestants = differenceInDays(anniversaireDate, today);
          
          return {
            id: enfant.id,
            prenom: enfant.prenom,
            nom: '', // Les enfants n'ont pas de nom dans la base
            date_naissance: enfant.date_naissance!,
            telephone: null,
            type: 'enfant' as const,
            parent_id: enfant.id_client,
            parent_nom: enfant.clients?.nom || '',
            parent_prenom: enfant.clients?.prenom || '',
            parent_telephone: enfant.clients?.telephone || null,
            jours_restants: joursRestants
          };
        })
        .filter(anniv => anniv.jours_restants <= 30); // Filtrer pour les 30 prochains jours
      
      // Combiner et trier par proximité de date
      const tousAnniversaires = [...clientsAnniversaires, ...enfantsAnniversaires]
        .sort((a, b) => a.jours_restants - b.jours_restants);
      
      setAnniversaires(tousAnniversaires);
    } catch (err: any) {
      console.error('Erreur lors du chargement des anniversaires:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
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
  
  // Formater l'âge
  const calculerAge = (dateString: string) => {
    try {
      const dateNaissance = parseISO(dateString);
      const today = new Date();
      let age = today.getFullYear() - dateNaissance.getFullYear();
      
      // Vérifier si l'anniversaire est déjà passé cette année
      const moisActuel = today.getMonth();
      const jourActuel = today.getDate();
      const moisNaissance = dateNaissance.getMonth();
      const jourNaissance = dateNaissance.getDate();
      
      if (moisActuel < moisNaissance || (moisActuel === moisNaissance && jourActuel < jourNaissance)) {
        age--;
      }
      
      return age;
    } catch (e) {
      return 0;
    }
  };
  
  // Créer un lien SMS
  const createSmsLink = (telephone: string | null, nom: string, prenom: string, age: number, isEnfant: boolean = false) => {
    if (!telephone) return '#';
    
    // Adapter le message en fonction de l'âge et du type (enfant ou adulte)
    let messageAnniversaire = '';
    
    if (isEnfant) {
      // Message pour l'anniversaire d'un enfant (adressé au parent)
      messageAnniversaire = `Bonjour, l'équipe d'Odyssée Sucrée souhaite un joyeux anniversaire à ${prenom} pour ses ${age} ans ! 🎂`;
    } else if (age <= 18) {
      // Message pour adolescent
      messageAnniversaire = `Bonjour ${prenom}, l'équipe d'Odyssée Sucrée vous souhaite un joyeux anniversaire pour vos ${age} ans ! 🎉`;
    } else if (age <= 60) {
      // Message pour jeune adulte
      messageAnniversaire = `Bonjour ${prenom}, l'équipe d'Odyssée Sucrée vous souhaite un joyeux anniversaire pour vos ${age} ans ! 🎂`;
    } else {
      // Message pour adulte (sans mention de l'âge)
      messageAnniversaire = `Bonjour ${prenom}, l'équipe d'Odyssée Sucrée vous souhaite un joyeux anniversaire ! 🎉`;
    }
    
    // Message complet avec signature et mention de la carte de gâteau
    const message = encodeURIComponent(`${messageAnniversaire}\n\nN'hésitez pas à nous contacter pour découvrir notre carte de gâteaux personnalisés pour votre événement.\n\nCordialement,\nAurore d'Odyssée Sucrée`);
    
    // Créer un lien qui ouvre l'application de messagerie
    return `sms:${telephone}?body=${message}`;
  };
  
  useEffect(() => {
    fetchAnniversaires();
  }, []);
  
  return (
    <DashboardLayout>
      <div className="p-4 pb-24 max-w-lg mx-auto text-black">
        {/* En-tête avec titre */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Anniversaires à venir</h1>
        </div>
        
        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {/* Chargement */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 p-4 rounded-lg">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Aucun anniversaire */}
            {anniversaires.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
                <p className="text-gray-600">Aucun anniversaire dans les 30 prochains jours.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {anniversaires.map((anniversaire) => {
                  // Déterminer le téléphone à utiliser (celui du parent pour les enfants)
                  const telephone = anniversaire.type === 'enfant' 
                    ? anniversaire.parent_telephone 
                    : anniversaire.telephone;
                  
                  // Déterminer le nom complet
                  const nomComplet = anniversaire.type === 'enfant'
                    ? `${anniversaire.prenom} (enfant de ${anniversaire.parent_prenom})`
                    : `${anniversaire.prenom} ${anniversaire.nom}`;
                  
                  // Calculer l'âge
                  const age = calculerAge(anniversaire.date_naissance);
                  const prochainAge = age + 1;
                  
                  // Créer le lien SMS
                  const smsLink = createSmsLink(
                    telephone || null, 
                    anniversaire.type === 'enfant' ? anniversaire.parent_nom || '' : anniversaire.nom,
                    anniversaire.prenom,
                    prochainAge, // L'âge qu'aura la personne à son prochain anniversaire
                    anniversaire.type === 'enfant' // Indiquer s'il s'agit d'un enfant
                  );
                  
                  return (
                    <div 
                      key={`${anniversaire.type}-${anniversaire.id}`} 
                      className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
                        anniversaire.jours_restants === 0 
                          ? 'border-red-500' 
                          : anniversaire.jours_restants <= 7 
                            ? 'border-orange-400' 
                            : 'border-[#A90BD9]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{nomComplet}</h3>
                          <p className="text-sm text-gray-600">
                            {anniversaire.jours_restants === 0 
                              ? <span className="text-red-600 font-medium">Aujourd'hui</span>
                              : anniversaire.jours_restants === 1
                                ? <span className="text-orange-600 font-medium">Demain</span>
                                : <span>Dans {anniversaire.jours_restants} jours</span>
                            }
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(anniversaire.date_naissance)} ({prochainAge} ans)
                          </p>
                        </div>
                        
                        {telephone ? (
                          <a 
                            href={smsLink}
                            className="bg-[#A90BD9] text-white p-2 rounded-full shadow-sm"
                            aria-label="Envoyer un SMS"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                          </a>
                        ) : (
                          <span className="bg-gray-200 text-gray-400 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
