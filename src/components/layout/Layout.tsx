"use client";

import { ReactNode, useState, useEffect } from 'react';
import Image from 'next/image';
import { Caveat, Poppins } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const router = useRouter();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogoClick = () => {
    setLogoClicks(prev => prev + 1);
  };
  
  useEffect(() => {
    if (logoClicks >= 3) {
      // Réinitialiser le compteur
      setLogoClicks(0);
      // Rediriger vers la page de connexion
      router.push('/admin/login');
    }
    
    // Réinitialiser le compteur après un délai si l'utilisateur ne clique pas assez rapidement
    const timer = setTimeout(() => {
      if (logoClicks > 0 && logoClicks < 3) {
        setLogoClicks(0);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [logoClicks, router]);
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 py-2 px-6 md:px-12 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-2">
          {/* Logo avec détection de clics */}
          <div onClick={handleLogoClick} className="cursor-pointer">
            <Image 
              src="/logo.png" 
              alt="Logo Odyssée Sucrée"
              width={25} 
              height={25} 
              className="object-contain"
            />
          </div>
          <div onClick={handleLogoClick}>
            <h1 className={`${caveat.className} text-[#A90BD9] text-2xl`}>Odyssée Sucrée</h1>
          </div>
        </div>
        <nav className={`${poppins.className} hidden md:flex space-x-6 text-xs text-gray-700`}>
          <Link href="/" className="hover:text-[#D90BB5] transition-colors">Accueil</Link>
          <Link href="/desserts" className="hover:text-[#D90BB5] transition-colors">Desserts</Link>
          <Link href="/gateaux" className="hover:text-[#D90BB5] transition-colors">Gâteaux</Link>
          <Link href="/cake-design" className="hover:text-[#D90BB5] transition-colors">Cake Design</Link>
          <Link href="/about" className="hover:text-[#D90BB5] transition-colors">À propos</Link>
        </nav>
        <button 
          className="md:hidden text-[#A90BD9] z-50" 
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
        
        {/* Menu mobile */}
        <div 
          className={`fixed inset-0 bg-white z-40 md:hidden flex flex-col pt-20 px-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
          <nav className={`${poppins.className} flex flex-col space-y-6 text-center`}>
            <Link 
              href="/" 
              className="text-gray-700 hover:text-[#D90BB5] transition-colors py-2 border-b border-gray-100"
              onClick={toggleMobileMenu}
            >
              Accueil
            </Link>
            <Link 
              href="/desserts" 
              className="text-gray-700 hover:text-[#D90BB5] transition-colors py-2 border-b border-gray-100"
              onClick={toggleMobileMenu}
            >
              Desserts
            </Link>
            <Link 
              href="/gateaux" 
              className="text-gray-700 hover:text-[#D90BB5] transition-colors py-2 border-b border-gray-100"
              onClick={toggleMobileMenu}
            >
              Gâteaux
            </Link>
            <Link 
              href="/cake-design" 
              className="text-gray-700 hover:text-[#D90BB5] transition-colors py-2 border-b border-gray-100"
              onClick={toggleMobileMenu}
            >
              Cake Design
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-[#D90BB5] transition-colors py-2 border-b border-gray-100"
              onClick={toggleMobileMenu}
            >
              À propos
            </Link>
            
            {/* Bouton d'accès admin caché en bas du menu mobile */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button 
                onClick={() => {
                  router.push('/admin/login');
                  toggleMobileMenu();
                }}
                className="text-xs text-gray-400 hover:text-[#D90BB5] transition-colors py-2"
              >
                Accès Administration
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className={`${poppins.className} bg-gray-50 py-8 px-6 md:px-12`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/logo.png" 
                alt="Logo Odyssée Sucrée" 
                width={28} 
                height={28} 
                className="object-contain"
              />
              <h3 className={`${caveat.className} text-[#A90BD9] text-xl`}>Odyssée Sucrée</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Pâtisserie traditionnelle et cake design personnalisés sur commande. Livraison possible.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/desserts" className="hover:text-[#D90BB5] transition-colors">Desserts</Link></li>
              <li><Link href="/gateaux" className="hover:text-[#D90BB5] transition-colors">Gâteaux</Link></li>
              <li><Link href="/layer-cake" className="hover:text-[#D90BB5] transition-colors">Layer Cake</Link></li>
              <li><Link href="/number-cake" className="hover:text-[#D90BB5] transition-colors">Number Cake</Link></li>
              <li><Link href="/sweet-table" className="hover:text-[#D90BB5] transition-colors">Sweet Table</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Contact</h4>
            <address className="not-italic text-sm text-gray-600 space-y-2">
              <p>101 route de l'Honor de Cos</p>
              <p>82220 PUYCORNET</p>
              <p>Email: <a href="mailto:odysseesucree82@gmail.com" className="hover:text-[#D90BB5] transition-colors">odysseesucree82@gmail.com</a></p>
              <p>Tél: 06 34 84 91 82</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Odyssée Sucrée. Tous droits réservés.</p>
          <p className="mt-2">Heures d'ouverture: Mardi - Samedi 9h - 18h30, Dimanche 9h - 12h</p>
        </div>
      </footer>
    </div>
  );
}
