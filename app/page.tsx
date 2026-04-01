import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import DrawMechanic from '@/components/home/DrawMechanic';
import CharitySpotlight from '@/components/home/CharitySpotlight';
import PricingSection from '@/components/home/PricingSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="bg-[#0A0A0F] min-h-screen text-[#F8FAFC] font-dm-sans selection:bg-[#10B981]/30">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <DrawMechanic />
        <CharitySpotlight />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
