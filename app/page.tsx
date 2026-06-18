import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  HeroSection,
  AboutSection,
  MenuSection,
  ServicesSection,
  ReservationSection,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <ServicesSection />
      <ReservationSection />
      <Footer />
    </div>
  );
}
