import HeroSection from '@/modules/invite/save-the-date/components/HeroSection';
import CountdownSection from '@/modules/invite/save-the-date/components/CountdownSection';
import CTASection from '@/modules/invite/save-the-date/components/CTASection';
import Footer from '@/modules/invite/save-the-date/components/Footer';

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
