"use client";

import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { Caveat, Poppins } from 'next/font/google';
import Link from 'next/link';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 py-2 px-6 md:px-12 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Image 
            src="/logo.png" 
            alt="Logo Odyssée Sucrée"
            width={25} 
            height={25} 
            className="object-contain"
          />
          <h1 className={`${caveat.className} text-[#A90BD9] text-2xl`}>Odyssée Sucrée</h1>
        </div>
        <nav className={`${poppins.className} hidden md:flex space-x-6 text-xs text-gray-700`}>
          <Link href="#" className="hover:text-[#D90BB5] transition-colors">Notre Histoire</Link>
          <Link href="#" className="hover:text-[#D90BB5] transition-colors">Créations</Link>
          <Link href="#" className="hover:text-[#D90BB5] transition-colors">Boutique</Link>
          <Link href="#" className="hover:text-[#D90BB5] transition-colors">Contact</Link>
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
              href="#" 
              className="text-gray-700 hover:text-[#D90BB5] transition-colors py-2 border-b border-gray-100"
              onClick={toggleMobileMenu}
            >
              Notre Histoire
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-[#D90BB5] transition-colors py-2 border-b border-gray-100"
              onClick={toggleMobileMenu}
            >
              Créations
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-[#D90BB5] transition-colors py-2 border-b border-gray-100"
              onClick={toggleMobileMenu}
            >
              Boutique
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-[#D90BB5] transition-colors py-2 border-b border-gray-100"
              onClick={toggleMobileMenu}
            >
              Contact
            </Link>
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
              Pâtisseries artisanales faites à la main avec passion et créativité.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-[#D90BB5] transition-colors">Notre Histoire</Link></li>
              <li><Link href="#" className="hover:text-[#D90BB5] transition-colors">Créations</Link></li>
              <li><Link href="#" className="hover:text-[#D90BB5] transition-colors">Boutique</Link></li>
              <li><Link href="#" className="hover:text-[#D90BB5] transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Contact</h4>
            <address className="not-italic text-sm text-gray-600 space-y-2">
              <p>123 Rue de la Pâtisserie</p>
              <p>75001 Paris, France</p>
              <p>Email: contact@odysseesucree.fr</p>
              <p>Tél: +33 1 23 45 67 89</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Odyssée Sucrée. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
