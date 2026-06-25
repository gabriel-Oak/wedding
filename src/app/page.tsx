import HeroSection from '@/components/HeroSection';
import CountdownSection from '@/components/CountdownSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <CountdownSection />
      <CTASection />
      <Footer />
    </main>
  );
}
