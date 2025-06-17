"use client";

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Poppins } from 'next/font/google';
import { supabase } from '../../../utils/supabase';
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
    <div className={`${poppins.className} flex flex-col md:flex-row min-h-screen bg-gray-50`}>
      {/* Sidebar - visible uniquement sur desktop, gérée par le composant */}
      <Sidebar />
      
        
        {/* Contenu du dashboard */}
        <main className="p-3 sm:p-6 flex-grow">
          {children}
        </main>
    </div>
  );
}
