import Nav from '@/components/sections/Nav';
import Hero from '@/components/sections/Hero';
import Ticker from '@/components/sections/Ticker';
import Stats from '@/components/sections/Stats';
import HowItWorks from '@/components/sections/HowItWorks';
import ProductPreview from '@/components/sections/ProductPreview';
import Categories from '@/components/sections/Categories';
import Pricing from '@/components/sections/Pricing';
import Testimonials from '@/components/sections/Testimonials';
import WaitlistCTA from '@/components/sections/WaitlistCTA';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="bg-obsidian min-h-screen">
      <Nav />
      <Hero />
      <Ticker />
      <Stats />
      <HowItWorks />
      <ProductPreview />
      <Categories />
      <Pricing />
      <Testimonials />
      <WaitlistCTA />
      <Footer />
    </main>
  );
}
