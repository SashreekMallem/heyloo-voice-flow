import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DashboardPreview } from "@/components/DashboardPreview";
import { PricingSection } from "@/components/PricingSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="dashboard">
          <DashboardPreview />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
