import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TunisieSection from "@/components/TunisieSection";
import ServicesSection from "@/components/ServicesSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import TrustBanner from "@/components/TrustBanner";
import ProcessSection from "@/components/ProcessSection";
import QuoteSection from "@/components/QuoteSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <TunisieSection />
        <ServicesSection />
        <ExpertiseSection />
        <ProcessSection />
        <QuoteSection />
        <TrustBanner />
      </main>
      <Footer />
    </>
  );
}
