"use client";

import { useState } from 'react';
import { Caveat, Poppins } from 'next/font/google';
import Image from 'next/image';
import { supabase } from '../../../utils/supabase';
import { useRouter } from 'next/navigation';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Si la connexion réussit, rediriger vers le tableau de bord admin
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#FFF8FD] to-[#F9F5FF] px-4 text-black">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo.png" 
              alt="Logo Odyssée Sucrée" 
              width={60} 
              height={60} 
              className="object-contain"
            />
          </div>
          <h1 className={`${caveat.className} text-3xl text-[#A90BD9] mb-2`}>
            Administration Odyssée Sucrée
          </h1>
          <p className={`${poppins.className} text-sm text-gray-600`}>
            Connectez-vous pour gérer votre site
          </p>
        </div>
        
        {/* Formulaire de connexion */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label 
                htmlFor="email" 
                className={`${poppins.className} block text-sm font-medium text-gray-700 mb-1`}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A90BD9] focus:border-transparent"
                required
              />
            </div>
            
            <div className="mb-6">
              <label 
                htmlFor="password" 
                className={`${poppins.className} block text-sm font-medium text-gray-700 mb-1`}
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A90BD9] focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`${poppins.className} w-full bg-[#A90BD9] text-white py-2 px-4 rounded-md hover:bg-[#D90BB5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A90BD9] focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className={`${poppins.className} text-xs text-gray-500`}>
              Accès réservé aux administrateurs
            </p>
          </div>
        </div>
        
        {/* Bouton de retour */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => router.push('/')}
            className={`${poppins.className} text-sm text-[#A90BD9] hover:text-[#D90BB5]`}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
