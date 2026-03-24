export const dynamic = 'force-dynamic';
import Hero from "@/components/Hero/Hero";
import HeroStrap from "@/components/Hero/HeroStrap";
import FeaturesDashboard from "@/components/Features/FeaturesDashboard";
import EventsCarousel from "@/components/Events/EventsCarousel";
import TeamSection from "@/components/Team/TeamSection";
import Partners from '@/components/Partners/Partners';
import CTA from "@/components/CTA/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <HeroStrap />
      <FeaturesDashboard />
      <EventsCarousel />
      <TeamSection />
      <Partners />
      <CTA />
    </>
  );
}
