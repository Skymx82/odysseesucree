import Image from 'next/image';
import { Caveat, Poppins } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Arrière-plan clair avec dégradés subtils */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white via-[#FFF8FD] to-[#F9F5FF]">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#D90BB5] opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#A90BD9] opacity-5 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-[#D90BB5] opacity-10 blur-2xl"></div>
      </div>
      
      {/* Contenu */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {/* Éléments décoratifs */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#D90BB5]/10 rounded-full blur-md"></div>
            <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-[#A90BD9]/10 rounded-full blur-md"></div>
            
            {/* Badges */}
            <div className="flex gap-3 mb-6">
              <div className="bg-[#D90BB5]/10 px-3 py-1 rounded-full">
                <p className={`${poppins.className} text-xs text-[#D90BB5] font-medium`}>Artisanal</p>
              </div>
              <div className="bg-[#A90BD9]/10 px-3 py-1 rounded-full">
                <p className={`${poppins.className} text-xs text-[#A90BD9] font-medium`}>Fait Maison</p>
              </div>
            </div>
            
            {/* Titre avec logo et accent */}
            <div className="w-16 h-1 bg-[#D90BB5] mb-4"></div>
            <div className="flex items-center gap-3 mb-4">
              {/* Logo */}
              <Image 
                src="/logo.png" 
                alt="Logo Odyssée Sucrée" 
                width={48} 
                height={48} 
                className="object-contain"
              />
              <h2 className={`${caveat.className} text-4xl md:text-6xl leading-tight text-[#A90BD9]`}>
                Odyssée Sucrée
              </h2>
            </div>
            
            {/* Description enrichie */}
            <p className={`${poppins.className} text-lg mb-5 font-light text-gray-700 max-w-md`}>
              Pâtisseries artisanales faites à la main avec passion et créativité.
            </p>
            
            {/* Points forts */}
            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#D90BB5]/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#D90BB5]"></div>
                </div>
                <p className={`${poppins.className} text-sm text-gray-600`}>Ingrédients locaux et de saison</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#D90BB5]/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#D90BB5]"></div>
                </div>
                <p className={`${poppins.className} text-sm text-gray-600`}>Recettes uniques et créatives</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#D90BB5]/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#D90BB5]"></div>
                </div>
                <p className={`${poppins.className} text-sm text-gray-600`}>Livraison à domicile disponible</p>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#" 
                className={`${poppins.className} bg-[#A90BD9] text-white hover:bg-[#D90BB5] py-2 px-6 transition-colors text-center text-sm tracking-wide shadow-md`}
              >
                DÉCOUVRIR
              </a>
              <a 
                href="#" 
                className={`${poppins.className} border border-[#A90BD9] text-[#A90BD9] hover:bg-[#A90BD9]/5 py-2 px-6 transition-colors text-center text-sm tracking-wide`}
              >
                COMMANDER
              </a>
            </div>
          </div>
          
          {/* Image avec détails */}
          <div className="relative hidden md:block">
            {/* Cadre photo avec bords blancs */}
            <div className="relative bg-white p-4 shadow-md rounded-sm max-w-md mx-auto">
              <div className="relative">
                <Image
                  src="/hero1.png"
                  alt="Pâtisserie signature"
                  width={450}
                  height={350}
                  className="object-cover w-full h-auto"
                  priority
                  quality={100}
                />
                
                {/* Légende simple en bas de la photo */}
                <div className="mt-2 text-center">
                  <p className={`${caveat.className} text-gray-800 text-xl`}>Collection 2025</p>
                  <p className={`${poppins.className} text-xs text-gray-600 mt-1`}>Fait Maison et Produits Locaux</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center">
            <p className={`${poppins.className} text-xs text-[#A90BD9] mb-2 tracking-widest`}>SCROLL</p>
            <div className="w-px h-8 bg-gradient-to-b from-[#D90BB5]/30 to-[#D90BB5]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
