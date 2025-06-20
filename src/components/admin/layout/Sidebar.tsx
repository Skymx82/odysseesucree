"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Caveat, Poppins } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px est le breakpoint standard pour md dans Tailwind
    };
    
    // Vérifier au chargement
    checkIfMobile();
    
    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkIfMobile);
    
    // Nettoyer l'event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const menuItems = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Fichier Clients', path: '/admin/dashboard/clients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Commandes', path: '/admin/dashboard/commandes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Stock', path: '/admin/dashboard/stock', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Marchés', path: '/admin/dashboard/marches', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Anniversaires', path: '/admin/dashboard/anniversaires', icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z' },
  ];

  // Sidebar pour mobile (en bas de l'écran)
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
        {/* Menu de navigation mobile */}
        <nav className={`${poppins.className}`}>
          <ul className="flex justify-around items-center">
            {menuItems.map((item) => (
              <li key={item.path} className="flex-1">
                <Link 
                  href={item.path}
                  className={`flex items-center justify-center py-3 ${pathname === item.path ? 'text-[#A90BD9]' : 'text-gray-600'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }
  
  // Sidebar pour desktop
  return (
    <div className={`bg-white shadow-md h-screen transition-all duration-300 hidden md:block ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* En-tête de la sidebar */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Logo Odyssée Sucrée" 
            width={30} 
            height={30} 
            className="object-contain"
          />
          {!collapsed && (
            <h2 className={`${caveat.className} text-[#A90BD9] text-xl`}>Admin</h2>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-[#A90BD9]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Menu de navigation desktop */}
      <nav className={`${poppins.className} py-4`}>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center px-4 py-3 ${pathname === item.path ? 'bg-[#A90BD9]/10 text-[#A90BD9] border-r-4 border-[#A90BD9]' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {!collapsed && (
                  <span className="ml-3 text-sm">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Pied de la sidebar desktop */}
      <div className="absolute bottom-0 w-full border-t border-gray-100 p-4">
        <Link 
          href="/"
          className="flex items-center text-gray-600 hover:text-[#A90BD9]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          {!collapsed && (
            <span className="ml-3 text-sm">Retour au site</span>
          )}
        </Link>
      </div>
    </div>
  );
}