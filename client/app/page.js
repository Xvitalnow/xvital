export const metadata = {
  title: "XVITAL – Personalized Nutrition & Lifestyle System",
  description:
    "XVITAL provides personalized nutrition plans, health assessments, and lifestyle optimization programs designed for Indian lifestyles and body needs.",

  keywords: [
    "personalized nutrition",
    "diet plan India",
    "fat loss program",
    "health assessment",
    "nutrition coach",
    "Indian diet plan",
    "PCOS diet",
    "muscle retention diet",
    "wellness coaching",
    "personalized health program"
  ],

  openGraph: {
    title: "XVITAL – Personalized Nutrition System",
    description:
      "Personalized nutrition and lifestyle optimization for Indian lifestyles.",
    url: "https://xvital.in",
    siteName: "XVITAL",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "XVITAL",
    description:
      "Personalized nutrition system designed for your body and lifestyle.",
    images: ["/og-image.jpg"],
  },
};



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

