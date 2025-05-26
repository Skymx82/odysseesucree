import { Caveat, Poppins } from 'next/font/google';
import Image from 'next/image';
import Layout from '../components//layout/Layout';
import Hero from '../components/acceuil/Hero';
import FeaturedCreations from '../components/acceuil/FeaturedCreations';
import SectionDivider from '../components/acceuil/SectionDivider';
import OurStory from '../components/acceuil/OurStory';
import Testimonials from '../components/acceuil/Testimonials';
import ColoredDivider from '../components/acceuil/ColoredDivider';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <Hero />
        
        {/* Séparateur de section */}
        <SectionDivider />
        
        {/* Nos Créations Phares */}
        <FeaturedCreations />
        
        
        {/* Notre Histoire */}
        <OurStory />
        
        {/* Séparateur de section coloré */}
        <ColoredDivider topColor="#FFFFFF" bottomColor="#F3E8FF" />
        
        {/* Témoignages Clients */}
        <Testimonials />
      </div>
    </Layout>
  );
}