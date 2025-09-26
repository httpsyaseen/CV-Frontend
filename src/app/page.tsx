import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
