"use client";

import { useState, useEffect } from "react";
import PackageCard from "@/app/components/packages/packageCard.js";
import PackageModal from "@/app/components/packages/packageModal.js";
import ComparisonTable from "@/app/components/packages/comparisonTable.js";
import ScrollToPackages from "../components/packages/scrollToPackages";
import { packages } from "@/app/packages/data/packages.js";
import { useXVitalFlow } from "@/app/context/XVitalFlowContext";
import { BackendURL } from "../lib/config/url";
import { showToast } from "../lib/toast";

export default function PackagesPage() {
  const [selected, setSelected] = useState(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { consultationForm, answers } = useXVitalFlow();

  // ✅ Load Razorpay script
  useEffect(() => {
    const loadScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          setIsRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadScript();
  }, []);

  // ✅ Handle Buy
  const handleBuy = async (pkg) => {
    setIsLoading(true);

    try {
      if (!isRazorpayLoaded) {
        showToast("Payment system is loading. Please try again.", "error");
        setIsLoading(false);
        return;
      }

      // 🔹 Create Order
      const res = await fetch(`${BackendURL}/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: pkg.id,
        }),
      });

      const data = await res.json();

      if (!data.order) {
        showToast("Something went wrong", "error");
        setIsLoading(false);

        return;
      }

      // 🔹 Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: "INR",
        name: "XVital",
        description: pkg.name,
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${BackendURL}/order/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                payment: response,
                packageId: pkg.id,
                userData: {
                  name: consultationForm.name,
                  email: consultationForm.email,
                  phone: consultationForm.phone,
                  answers,
                },
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              showToast("Payment Successful 🎉", "success");
              setIsLoading(false); 
              setSelected(null);
            } else {
              showToast("Payment verification failed", "error");
              setIsLoading(false);
            }
          } catch (err) {
            console.error("VERIFY ERROR:", err);
            showToast("Something went wrong after payment", "error");
            setIsLoading(false);
          } finally {
            setIsLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            showToast("Payment cancelled", "error");
            setIsLoading(false);
            setSelected(null);
          },
        },

        prefill: {
          name: consultationForm.name || "",
          email: consultationForm.email || "",
          contact: consultationForm.phone || "",
        },

        theme: {
          color: "#3E1747",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      showToast("Payment failed to start", "error");
      setIsLoading(false);
    }
  };

  return (
    <section className="relative pt-36 md:pt-32 pb-32 bg-[#FAFAFB] overflow-hidden">
        {/* 🔥 Scroll To Packages Button */}
        <ScrollToPackages />
      <div className="max-w-6xl mx-auto">


        {/* 🔥 Comparison FIRST */}
        
        <ComparisonTable />


        {/* 🔹 Packages */}
        {/* Heading */}
      <div className="text-center mb-5 mt-35">
        <h1 className="text-4xl font-semibold text-[#111111] mb-4">
          Choose XVital Packages
        </h1>
        <p className="text-[#3E1747]/60">
          Select the perfect plan that suits your health needs and budget.
        </p>
      </div>
        <div className="mt-15 grid md:grid-cols-2 gap-8">
          
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              data={pkg}
              onSelect={setSelected}
            />
          ))}
        </div>

      </div>
      

      {/* 🔹 Modal */}
      {selected && (
        <PackageModal
          data={selected}
          onClose={() => setSelected(null)}
          onBuy={handleBuy}
          loading={isLoading}
        />
      )}
    </section>
  );
}