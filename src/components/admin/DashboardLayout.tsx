"use client";

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Poppins } from 'next/font/google';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  // Vérifier l'authentification de l'utilisateur
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }
      
      setUserName(session.user.email || 'Admin');
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#A90BD9] border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className={`${poppins.className} mt-4 text-gray-600`}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${poppins.className} flex h-screen bg-gray-50`}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenu principal */}
      <div className="flex-1 overflow-auto">
        {/* En-tête du dashboard */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-800">Gestion Odyssée Sucrée</h1>
          
          <div className="flex items-center gap-4">
            
            {/* Menu utilisateur */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#A90BD9]">
                <div className="w-8 h-8 rounded-full bg-[#A90BD9] text-white flex items-center justify-center">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span>{userName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profil</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</a>
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Contenu du dashboard */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
