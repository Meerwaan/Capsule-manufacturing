import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TunisieSection from "@/components/TunisieSection";
import ServicesSection from "@/components/ServicesSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import MaterialsSection from "@/components/MaterialsSection";
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
        <MaterialsSection />
        <ProcessSection />
        <QuoteSection />
        <TrustBanner />
      </main>
      <Footer />
    </>
  );
}
