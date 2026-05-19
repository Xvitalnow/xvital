import DietSection from "./index.js";

export const metadata = {
  title: "Personalized Diet Plans for Indian Lifestyles | XVITAL",
  description:
    "Discover personalized diet plans designed for fat loss, better energy, digestion, and sustainable health for Indian lifestyles.",

  keywords: [
    "personalized diet plan",
    "Indian diet plan",
    "fat loss diet",
    "PCOS diet India",
    "healthy lifestyle",
    "nutrition plan India"
  ],

  alternates: {
    canonical: "https://xvital.in/diet",
  },

  openGraph: {
    title: "Personalized Diet Plans | XVITAL",
    description:
      "Personalized nutrition and sustainable fat loss plans designed for Indian lifestyles.",
    url: "https://xvital.in/diet",
    siteName: "XVITAL",
    locale: "en_IN",
    type: "website",
  },
};

export default function ConsultationPage() {
  return <>
  <DietSection />
  {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Personalized Diet Plans",
            url: "https://www.xvital.in/diet",
            description:
              "Personalized diet plans for fat loss, energy, digestion, and wellness.",
            about: {
              "@type": "Thing",
              name: "Nutrition & Diet Planning",
            },
          }),
        }}
      />
  </>;
}