import Image from 'next/image';
import { Caveat, Poppins } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function OurStory() {
  return (
    <div className="relative">
      {/* Séparateur de section ondulé - transition entre les deux sections */}
      <div className="w-full h-12 overflow-hidden relative bg-[#FFF8FD]">
        <svg
          className="absolute bottom-0 w-full h-auto"
          viewBox="0 0 1200 30"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF8FD" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
          </defs>
          <path 
            d="M0,0 C300,30 600,0 900,20 C1000,30 1100,15 1200,0 L1200,30 L0,30 Z"
            fill="url(#gradient)"
          ></path>
        </svg>
      </div>

      <section className="py-16 bg-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#D90BB5] opacity-5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#A90BD9] opacity-5 blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12">
        {/* Titre de section */}
        <div className="flex flex-col items-center mb-12">
          <h2 className={`${caveat.className} text-4xl md:text-5xl text-[#A90BD9] mb-3`}>Mon Histoire</h2>
          <div className="w-20 h-1 bg-[#D90BB5]"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Partie image */}
          <div className="relative order-2 md:order-1">
            <div className="relative">
              {/* Image principale */}
              <div className="relative z-10 bg-white p-3 shadow-md rounded-sm max-w-md mx-auto rotate-[-3deg]">
                <Image
                  src="/aurore.png"
                  alt="Aurore, fondatrice d'Odyssée Sucrée"
                  width={500}
                  height={400}
                  className="object-cover w-full h-auto"
                />
              </div>
              
              {/* Image secondaire */}
              <div className="absolute top-[-20px] right-[-20px] z-0 bg-white p-2 shadow-md rounded-sm w-32 h-32 rotate-[5deg]">
                <Image
                  src="/story2.jpg"
                  alt="Création pâtissière"
                  width={120}
                  height={120}
                  className="object-cover w-full h-full"
                />
                <p className={`${caveat.className} text-xs text-center mt-1 text-gray-700`}>Cake design</p>
              </div>
              
              {/* Élément décoratif */}
              <div className="absolute bottom-[-15px] left-[-15px] w-24 h-24 bg-[#F9F5FF] rounded-full flex items-center justify-center">
                <p className={`${caveat.className} text-sm text-center text-[#A90BD9]`}>Depuis 2023</p>
              </div>
            </div>
          </div>
          
          {/* Partie texte */}
          <div className="order-1 md:order-2">
            <h3 className={`${poppins.className} text-xl font-medium text-gray-800 mb-4`}>Une reconversion passionnée</h3>
            
            <div className="space-y-4">
              <p className={`${poppins.className} text-gray-600`}>
                Mon premier parcours professionnel a été dans l'enseignement. Pendant 20 ans, j'ai été professeur des écoles. 
                La pâtisserie est devenue une passion qui s'est développée avec l'arrivée de mes enfants.
              </p>
              
              <p className={`${poppins.className} text-gray-600`}>
                En septembre 2022, j'ai quitté l'Education Nationale pour reprendre des études. Je me suis inscrite au CAP pâtissier 
                et je me suis entraînée pendant un an tout en travaillant comme pâtissière chez Mauranes et chez Alexandres à Montauban.
              </p>

              <p className={`${poppins.className} text-gray-600`}>
                Après avoir obtenu mon CAP en juin 2023, j'ai souhaité retrouver ma liberté et ma créativité. C'est ainsi qu'est née 
                Odyssée Sucrée en octobre 2023. Pourquoi ce nom? Car après 20 ans dans la fonction publique, c'est une sacrée odyssée 
                que de découvrir le monde de l'artisanat et de l'entreprenariat!
              </p>
              
              <div className="flex items-start gap-3 mt-6">
                <div className="w-4 h-4 rounded-full bg-[#D90BB5]/20 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#D90BB5]"></div>
                </div>
                <p className={`${poppins.className} text-gray-700 font-medium`}>
                  Je compte sur vous pour m'aider à transformer cette idée folle en un succès.
                </p>
              </div>
            </div>
            
            {/* Signature */}
            <div className="mt-8">
              <h3 className={`${caveat.className} text-[#A90BD9] text-xl`}>Odyssée Sucrée</h3>
              <p className={`${poppins.className} text-sm text-gray-500 mt-1`}>Aurore</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
