"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Caveat, Poppins } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

// Données des créations phares basées sur les vrais gâteaux d'Odyssée Sucrée
const featuredItems = [
  {
    id: 1,
    name: "Saint-Honoré",
    description: "Pâte feuilletée garnie de choux caramélisés et d'une délicate crème chiboust à la vanille de Madagascar.",
    price: "6,90 €",
    image: "/creations/saint-honore.png",
    tags: ["Classique", "Gourmand"]
  },
  {
    id: 2,
    name: "Fraisier",
    description: "Génoise moelleuse garnie de fraises fraîches de saison et d'une crème mousseline à la vanille.",
    price: "6,50 €",
    image: "/creations/fraisier.png",
    tags: ["Bestseller", "Fruité"]
  },
  {
    id: 3,
    name: "Paris-Brest",
    description: "Pâte à choux croustillante garnie d'une crème mousseline au praliné noisette maison.",
    price: "7,20 €",
    image: "/creations/paris-brest.png",
    tags: ["Signature", "Gourmand"]
  },
  {
    id: 4,
    name: "Pavlova Fruitée",
    description: "Meringue croustillante à l'extérieur et fondante à l'intérieur, garnie de crème fouettée et fruits frais de saison.",
    price: "6,90 €",
    image: "/creations/pavlova.png",
    tags: ["Léger", "Fruité"]
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
            Nos Gâteaux Phares
          </h2>
          <div className="w-20 h-1 bg-[#D90BB5] mx-auto mb-4"></div>
          <p className={`${poppins.className} text-gray-600 max-w-2xl mx-auto`}>
            Découvrez nos gâteaux signatures, élaborés avec passion et des ingrédients frais de saison. Choix personnalisable sur demande.
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
            VOIR TOUS NOS GÂTEAUX
          </a>
        </div>
      </div>
    </section>
  );
}
