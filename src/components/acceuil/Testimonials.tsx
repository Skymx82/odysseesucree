"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Caveat, Poppins } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

// Données des témoignages clients (avis Google)
const testimonials = [
  {
    id: 1,
    name: "Marie L.",
    rating: 5,
    date: "Mars 2024",
    text: "Superbe découverte ! J'ai commandé un gâteau pour l'anniversaire de ma fille et il était non seulement magnifique mais aussi délicieux. Le cake design était exactement comme je l'avais imaginé. Je recommande vivement !",
    avatar: "/avatars/avatar1.png"
  },
  {
    id: 2,
    name: "Thomas D.",
    rating: 5,
    date: "Février 2024",
    text: "Des pâtisseries d'exception ! J'ai été bluffé par la qualité et la finesse des saveurs. On sent que tout est fait avec passion et des produits de qualité. Un grand bravo à Aurore !",
    avatar: "/avatars/avatar2.png"
  },
  {
    id: 3,
    name: "Sophie M.",
    rating: 5,
    date: "Janvier 2024",
    text: "Aurore a réalisé un gâteau pour mon mariage qui a fait l'unanimité ! Non seulement il était magnifique visuellement mais en plus il était succulent. Un grand merci pour votre professionnalisme et votre gentillesse.",
    avatar: "/avatars/avatar3.png"
  },
  {
    id: 4,
    name: "Laurent B.",
    rating: 5,
    date: "Décembre 2023",
    text: "Excellente pâtisserie ! J'ai commandé des mignardises pour un événement professionnel et tous mes clients ont adoré. Service impeccable et produits de grande qualité. Je n'hésiterai pas à refaire appel à Odyssée Sucrée.",
    avatar: "/avatars/avatar4.png"
  },
  {
    id: 5,
    name: "Céline R.",
    rating: 5,
    date: "Novembre 2023",
    text: "Des créations originales et délicieuses ! J'adore le fait que chaque pâtisserie soit unique. On sent le savoir-faire et la créativité. Mes enfants adorent les gâteaux personnalisés pour leurs anniversaires.",
    avatar: "/avatars/avatar5.png"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);

  // Fonction pour passer au témoignage suivant
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  // Fonction pour passer au témoignage précédent
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Défilement automatique
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextTestimonial();
      }, 5000); // Change toutes les 5 secondes
      
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Générer les étoiles pour la notation
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    ));
  };

  return (
    <section className="py-16 bg-[#F3E8FF] relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#D90BB5] opacity-5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#A90BD9] opacity-5 blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12">
        {/* Titre de section */}
        <div className="flex flex-col items-center mb-12">
          <h2 className={`${caveat.className} text-4xl md:text-5xl text-[#A90BD9] mb-3`}>Ce que disent nos clients</h2>
          <div className="w-20 h-1 bg-[#D90BB5]"></div>
        </div>
        
        {/* Carrousel de témoignages */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          ref={testimonialRef}
        >
          {/* Logo Google Reviews */}
          <div className="absolute top-0 right-0 flex items-center z-10">
            <p className={`${poppins.className} text-xs text-gray-500 mr-2`}>Avis Google</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="24" viewBox="0 0 272 92">
              <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
              <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
              <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
              <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
              <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
              <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
            </svg>
          </div>
          
          {/* Témoignages */}
          <div className="bg-white rounded-lg shadow-lg p-8 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <button 
                onClick={prevTestimonial}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Témoignage précédent"
              >
                <svg className="w-5 h-5 text-[#A90BD9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <button 
                onClick={nextTestimonial}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Témoignage suivant"
              >
                <svg className="w-5 h-5 text-[#A90BD9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="w-full flex-shrink-0 px-8"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D90BB5]/20">
                          <Image 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="absolute -bottom-2 right-0 bg-[#A90BD9] rounded-full w-6 h-6 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </div>
                      </div>
                      
                      <h3 className={`${poppins.className} font-medium text-gray-800`}>{testimonial.name}</h3>
                      <p className={`${poppins.className} text-xs text-gray-500 mb-2`}>{testimonial.date}</p>
                      
                      <div className="flex mb-4">
                        {renderStars(testimonial.rating)}
                      </div>
                      
                      <div className="relative">
                        <svg className="w-8 h-8 text-[#D90BB5]/10 absolute -top-4 -left-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className={`${poppins.className} text-gray-600 italic`}>
                          {testimonial.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Indicateurs */}
            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 mx-1 rounded-full ${
                    index === activeIndex ? 'bg-[#A90BD9]' : 'bg-gray-300'
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Lien vers Google Reviews */}
          <div className="text-center mt-6">
            <a 
              href="https://www.google.com/search?sca_esv=2859b14fb4899a7d&rlz=1C5CHFA_enFR1148FR1148&biw=1204&bih=636&sxsrf=AE3TifNgWTV_Hy1UHI7M1VpsxOnhD25MdA:1748265293292&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E5Z3Kx4KOByWagMmF7VwJRgDHNWWhMx-2IzvejiTdTN3Gc_YGAvzHT9o8K3Ype9mczn-17gXCEWUzGDZ1a_WKbQNSAe1WREehd2JDTlV1UesVaQC1A%3D%3D&q=Odyss%C3%A9e+Sucr%C3%A9e+Reviews&sa=X&ved=2ahUKEwjjpJ7em8GNAxWJSaQEHc4rCx0Q0bkNegQIMxAE" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${poppins.className} text-sm text-[#A90BD9] hover:text-[#D90BB5] transition-colors`}
            >
              Laissez votre avis sur Google →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
