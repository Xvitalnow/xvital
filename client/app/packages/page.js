import PackagesPage from "./index.js";

export const metadata = {
  title: "XVITAL Health Packages & Nutrition Plans",
  description:
    "Explore XVITAL personalized nutrition packages designed for fat loss, better energy, digestion, and sustainable health improvement.",

  keywords: [
    "nutrition packages",
    "health consultation",
    "fat loss package",
    "diet consultation India",
    "wellness plans",
    "personalized nutrition"
  ],

  alternates: {
    canonical: "https://www.xvital.in/products",
  },

  openGraph: {
    title: "XVITAL Health Packages",
    description:
      "Personalized health and nutrition plans for Indian lifestyles.",
    url: "https://www.xvital.in/products",
    siteName: "XVITAL",
    locale: "en_IN",
    type: "website",
  },
};

export default function Packages() {
  return <PackagesPage />;
}