"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Caveat, Poppins } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

// Données des créations phares
const featuredItems = [
  {
    id: 1,
    name: "Éclair Passion-Framboise",
    description: "Un éclair garni d'une crème légère à la passion et d'un confit de framboises fraîches.",
    price: "6,50 €",
    image: "/creations/eclair.png",
    tags: ["Signature", "Fruité"]
  },
  {
    id: 2,
    name: "Tarte Chocolat-Caramel",
    description: "Ganache au chocolat noir intense sur un lit de caramel au beurre salé et noisettes torréfiées.",
    price: "5,90 €",
    image: "/creations/tarte-chocolat.png",
    tags: ["Bestseller", "Chocolat"]
  },
  {
    id: 3,
    name: "Macaron Pistache-Cerise",
    description: "Coques craquantes à la pistache fourrées d'une ganache montée à la cerise griotte.",
    price: "2,20 €",
    image: "/creations/macaron.png",
    tags: ["Nouveau", "Délicat"]
  },
  {
    id: 4,
    name: "Paris-Brest Praliné",
    description: "Pâte à choux croustillante garnie d'une crème mousseline au praliné noisette maison.",
    price: "7,20 €",
    image: "/creations/paris-brest.png",
    tags: ["Classique", "Gourmand"]
  }
];

export default function FeaturedCreations() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-white to-[#FFF8FD]">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <h2 className={`${caveat.className} text-3xl md:text-4xl text-[#A90BD9] mb-3`}>
            Nos Créations Phares
          </h2>
          <div className="w-20 h-1 bg-[#D90BB5] mx-auto mb-4"></div>
          <p className={`${poppins.className} text-gray-600 max-w-2xl mx-auto`}>
            Découvrez nos pâtisseries signatures, élaborées avec passion et des ingrédients locaux de saison.
          </p>
        </div>

        {/* Grille des créations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Image du produit */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#00000030] to-transparent z-10"></div>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={300}
                  className={`object-cover w-full h-full transition-transform duration-500 ${hoveredItem === item.id ? 'scale-110' : 'scale-100'}`}
                />
                
                {/* Tags */}
                <div className="absolute top-3 left-3 z-20 flex gap-2">
                  {item.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-2 py-1 rounded-full bg-white/80 text-[#A90BD9] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Détails du produit */}
              <div className="p-4">
                <h3 className={`${caveat.className} text-xl text-[#A90BD9] mb-2`}>{item.name}</h3>
                <p className={`${poppins.className} text-sm text-gray-600 mb-3 line-clamp-2`}>
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`${poppins.className} font-semibold text-[#D90BB5]`}>{item.price}</span>
                  <button className="text-xs bg-[#A90BD9] text-white py-1 px-3 rounded-full hover:bg-[#D90BB5] transition-colors">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bouton "Voir toutes nos créations" */}
        <div className="text-center mt-12">
          <a 
            href="#" 
            className={`${poppins.className} inline-block bg-white border border-[#A90BD9] text-[#A90BD9] hover:bg-[#A90BD9] hover:text-white py-2 px-6 rounded-full transition-colors text-sm tracking-wide`}
          >
            VOIR TOUTES NOS CRÉATIONS
          </a>
        </div>
      </div>
    </section>
  );
}
