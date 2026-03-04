import Navbar              from '../components/Navbar';
import Hero                from '../components/Hero';
import FeaturesSection     from '../components/FeaturesSection';
import About               from '../components/About';
import Tickets             from '../components/Tickets';
import AIFeaturesSection   from '../components/AIFeaturesSection';
import WhiteMarketSection  from '../components/WhiteMarketSection';
import FoodSection         from '../components/FoodSection';
import ForCreators         from '../components/ForCreators';
import Contact             from '../components/Contact';
import Footer              from '../components/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <About />
        <Tickets />
        <AIFeaturesSection />
        <WhiteMarketSection />
        <FoodSection />
        <ForCreators />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
