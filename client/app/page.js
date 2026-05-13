import Hero from "./heroSections/hero";
import ProblemSection from "./heroSections/problemSection.js";
import ProtocolSection from "./heroSections/protocolSection.js";
import TimelineSection from "./heroSections/timelineSection.js";
import ProgramsSection from "./heroSections/programsSection.js";
import LifestyleGallery from "./heroSections/lifestyleGallery.js";
import ExpertSection from "./heroSections/expertSection.js";
import FinalCTA from "./heroSections/FinalCTA.js";
import ScrollToTopButton from "./components/ui/scrollToTop.js";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <ProtocolSection />
      <TimelineSection />
      <ProgramsSection />
      <LifestyleGallery />
      <ExpertSection />
      <FinalCTA />
      <ScrollToTopButton />
    </>
  );
}

