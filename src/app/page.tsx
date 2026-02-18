import Hero from "@/components/Hero/Hero";
import FeaturesDashboard from "@/components/Features/FeaturesDashboard";
import EventsCarousel from "@/components/Events/EventsCarousel";
import Partners from '@/components/Partners/Partners';
import CTA from "@/components/CTA/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesDashboard />
      <EventsCarousel />
      <Partners />
      <CTA />
    </>
  );
}
