import "./globals.css";
import { Inter, Julius_Sans_One } from "next/font/google";
import Header from "./layout/header";
import Footer from "./layout/footer";
import { XVitalFlowProvider } from "./context/XVitalFlowContext";
import FeedbackToast from "./components/ui/feedbackToast";
import OrdersFloatingButton from "./components/ui/ordersFloatingButton";

import Preloader from "./components/ui/preloader";
import { LoaderProvider } from "./context/LoaderContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300","400","500","600"]
});

const julius = Julius_Sans_One({
  subsets: ["latin"],
  weight: "400"
});

export const metadata = {
  title: "XVITAL | Premium Nutrition Protocol",
  description: "Science backed personalized nutrition protocol"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} ${julius.className} text-slate-800 bg-[#FAFAFA] antialiased w-full overflow-x-hidden`}>
        <XVitalFlowProvider>
          <Preloader />
          <LoaderProvider>
          <Header />
          {children}
          <Footer />
          <FeedbackToast />
          <OrdersFloatingButton />
          </LoaderProvider>
        </XVitalFlowProvider>
      </body>
    </html>
  );
}