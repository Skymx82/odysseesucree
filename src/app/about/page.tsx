"use client";

import Image from 'next/image';
import { Caveat, Poppins } from 'next/font/google';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function About() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const imageAnimation = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen pt-24 pb-16">
        {/* Arrière-plan décoratif */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-white via-[#FFF8FD] to-[#F9F5FF]">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#D90BB5] opacity-5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#A90BD9] opacity-5 blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-[#D90BB5] opacity-10 blur-2xl"></div>
        </div>
        
        {/* Contenu principal */}
        <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto">
          {/* En-tête */}
          <motion.div 
            className="mb-16 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="w-20 h-1 bg-[#D90BB5] mx-auto mb-4"></div>
            <h1 className={`${caveat.className} text-4xl md:text-5xl lg:text-6xl text-[#A90BD9] mb-4`}>
              À propos d'Odyssée Sucrée
            </h1>
            <p className={`${poppins.className} text-gray-600 max-w-2xl mx-auto`}>
              Découvrez l'histoire et la passion derrière nos créations sucrées
            </p>
          </motion.div>
          
          {/* Section principale */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Image avec animation */}
            <motion.div 
              className="relative"
              initial="hidden"
              animate="visible"
              variants={imageAnimation}
            >
              <div className="relative bg-white p-4 shadow-md rounded-sm">
                <Image
                  src="/aurore.png"
                  alt="Aurore - Fondatrice d'Odyssée Sucrée"
                  width={500}
                  height={400}
                  className="object-cover w-full h-auto"
                  priority
                />
                <div className="mt-2 text-center">
                  <p className={`${caveat.className} text-gray-800 text-xl`}>Aurore</p>
                  <p className={`${poppins.className} text-xs text-gray-600 mt-1`}>Fondatrice d'Odyssée Sucrée</p>
                </div>
              </div>
              
              {/* Éléments décoratifs */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#D90BB5]/10 rounded-full blur-md -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#A90BD9]/10 rounded-full blur-md -z-10"></div>
            </motion.div>
            
            {/* Texte avec animation */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div variants={fadeIn}>
                <div className="flex gap-3 mb-4">
                  <div className="bg-[#D90BB5]/10 px-3 py-1 rounded-full">
                    <p className={`${poppins.className} text-xs text-[#D90BB5] font-medium`}>Artisanat</p>
                  </div>
                  <div className="bg-[#A90BD9]/10 px-3 py-1 rounded-full">
                    <p className={`${poppins.className} text-xs text-[#A90BD9] font-medium`}>Passion</p>
                  </div>
                </div>
                <h2 className={`${caveat.className} text-3xl text-[#A90BD9] mb-3`}>
                  Bonjour !
                </h2>
                <p className={`${poppins.className} text-gray-700 mb-4`}>
                  Derrière Odyssée Sucrée se cache surtout Aurore mais aussi toute sa famille qui l'aide dans les livraisons par exemple.
                </p>
                <p className={`${poppins.className} text-gray-700 font-medium mb-4`}>
                  Mon but: vous proposer des douceurs personnalisées pour des moments enchantés.
                </p>
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <h3 className={`${caveat.className} text-2xl text-[#A90BD9] mb-3`}>
                  Mon histoire
                </h3>
                <p className={`${poppins.className} text-gray-700 mb-3`}>
                  Mon premier parcours professionnel a été dans l'enseignement. Pendant 20 ans, j'ai été professeur des écoles. La pâtisserie est devenue une passion qui s'est développée avec l'arrivée de mes enfants.
                </p>
                <p className={`${poppins.className} text-gray-700 mb-3`}>
                  En septembre 2022, j'ai quitté l'Education Nationale pour reprendre des études. Je me suis inscrite au CAP pâtissier et je me suis entraînée pendant un an tout en travaillant comme pâtissière chez Mauranes et chez Alexandres à Montauban.
                </p>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Section parcours */}
          <motion.div 
            className="max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-8">
              <h3 className={`${caveat.className} text-2xl text-[#A90BD9] mb-4 text-center`}>
                Mon parcours
              </h3>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-6">
                  <motion.div 
                    className="flex gap-4 items-start"
                    variants={fadeIn}
                  >
                    <div className="min-w-10 h-10 rounded-full bg-[#D90BB5]/20 flex items-center justify-center">
                      <span className={`${poppins.className} font-medium text-[#D90BB5]`}>1</span>
                    </div>
                    <div>
                      <h4 className={`${poppins.className} font-medium text-gray-800 mb-1`}>20 ans d'enseignement</h4>
                      <p className={`${poppins.className} text-sm text-gray-600`}>
                        Professeur des écoles pendant deux décennies, avec une passion grandissante pour la pâtisserie.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-4 items-start"
                    variants={fadeIn}
                  >
                    <div className="min-w-10 h-10 rounded-full bg-[#D90BB5]/20 flex items-center justify-center">
                      <span className={`${poppins.className} font-medium text-[#D90BB5]`}>2</span>
                    </div>
                    <div>
                      <h4 className={`${poppins.className} font-medium text-gray-800 mb-1`}>Formation professionnelle</h4>
                      <p className={`${poppins.className} text-sm text-gray-600`}>
                        En 2022, reconversion avec l'obtention d'un CAP pâtissier et expérience chez Mauranes et Alexandres à Montauban.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-4 items-start"
                    variants={fadeIn}
                  >
                    <div className="min-w-10 h-10 rounded-full bg-[#D90BB5]/20 flex items-center justify-center">
                      <span className={`${poppins.className} font-medium text-[#D90BB5]`}>3</span>
                    </div>
                    <div>
                      <h4 className={`${poppins.className} font-medium text-gray-800 mb-1`}>Perfectionnement en cake design</h4>
                      <p className={`${poppins.className} text-sm text-gray-600`}>
                        Formation continue en cake design chez Sweet Délices et en sablés décorés en glaçage royal.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-4 items-start"
                    variants={fadeIn}
                  >
                    <div className="min-w-10 h-10 rounded-full bg-[#D90BB5]/20 flex items-center justify-center">
                      <span className={`${poppins.className} font-medium text-[#D90BB5]`}>4</span>
                    </div>
                    <div>
                      <h4 className={`${poppins.className} font-medium text-gray-800 mb-1`}>Naissance d'Odyssée Sucrée</h4>
                      <p className={`${poppins.className} text-sm text-gray-600`}>
                        Création d'Odyssée Sucrée en octobre 2023, alliant pâtisserie traditionnelle et cake design personnalisé.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn} className="text-center">
              <p className={`${poppins.className} text-gray-700 italic mb-6`}>
                "Pourquoi ce nom? Car après 20 ans de bons et loyaux services dans la fonction publique, c'est une sacrée odyssée que de découvrir le monde de l'artisanat, de l'entreprenariat.... Mais quel plaisir de ne pas faire toujours le même gâteau, de relever des défis afin de vous satisfaire!"
              </p>
              <p className={`${poppins.className} text-gray-700 font-medium`}>
                — Aurore
              </p>
            </motion.div>
          </motion.div>
          
          {/* Call to action */}
          <motion.div 
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <p className={`${poppins.className} text-gray-700 mb-6`}>
              Je compte sur vous pour m'aider à transformer cette idée folle en un succès.
              <br />Donc n'attendez plus et prenez contact avec moi pour réaliser vos gourmandises préférées et personnalisables.
            </p>
            <a 
              href="mailto:odysseesucree82@gmail.com"
              className={`${poppins.className} inline-block bg-[#A90BD9] text-white hover:bg-[#D90BB5] py-3 px-8 rounded-md transition-colors text-sm tracking-wide shadow-md`}
            >
              COMMANDER MAINTENANT
            </a>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
