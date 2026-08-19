import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/home/Hero";
import ConcertShowcase from "../components/home/ConcertShowcase";
import ServiceOverview from "../components/home/ServiceOverview";
import AboutUs from "../components/home/AboutUs";
import { useEvents } from "../hooks/useEvents";

export default function Home() {
  const { events, loading, error } = useEvents();
  const location = useLocation();

  // Support deep-linking like /#concerts from other pages
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="snap-container">
      <Hero events={events} />
      <ConcertShowcase events={events} loading={loading} error={error} />
      <ServiceOverview />
      <AboutUs />
    </div>
  );
}
