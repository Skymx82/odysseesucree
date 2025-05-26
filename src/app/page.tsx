import { Caveat, Poppins } from 'next/font/google';
import Image from 'next/image';
import Layout from '../components//layout/Layout';
import Hero from '../components/Hero';

const caveat = Caveat({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <Hero />
      </div>
    </Layout>
  );
}