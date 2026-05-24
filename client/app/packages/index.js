"use client";

import { useState, useEffect } from "react";
import PackageCard from "@/app/components/packages/packageCard.js";
import PackageModal from "@/app/components/packages/packageModal.js";
import ComparisonTable from "@/app/components/packages/comparisonTable.js";
import ScrollToPackages from "../components/packages/scrollToPackages";
import PurchaseCheckModal from "@/app/components/purchaseCheckModal.js";
import { packages } from "@/app/packages/data/packages.js";
import { useXVitalFlow } from "@/app/context/XVitalFlowContext";
import { BackendURL } from "../lib/config/url";
import { showToast } from "../lib/toast";
import { useRouter } from "next/navigation";


export default function PackagesPage() {
  const [showPurchaseCheckModal, setShowPurchaseCheckModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] =
    useState(false);
  const [showPaymentFailedModal, setShowPaymentFailedModal] =
    useState(false);

  const { consultationForm, answers } = useXVitalFlow();
  
  const emailFromContext = consultationForm.email;
  const emailFromStorage = typeof window !== "undefined" ? localStorage.getItem("email") : null;
  //if email is present in context, use it. Otherwise, fallback to local storage (in case user refreshes page after assessment)
  const email = emailFromContext || emailFromStorage;
  // If email is still not found, redirect to home page (since email is essential for the flow)
  const router = useRouter();
  useEffect(() => {
    if (!email) {
      showToast("Session expired. Please start the assessment again.", "error");
      router.push("/");
    }
  }, [email, router]);

  // ✅ Load Razorpay script
  useEffect(() => {

    const existingScript =
      document.getElementById(
        "razorpay-script"
      );

    if (existingScript) {

      setIsRazorpayLoaded(true);

      return;
    }

    const script =
      document.createElement("script");

    script.id = "razorpay-script";

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {

      console.log(
        "Razorpay Loaded"
      );

      setIsRazorpayLoaded(true);
    };

    script.onerror = () => {

      console.error(
        "Razorpay failed to load"
      );
    };

    document.body.appendChild(script);

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
              setShowPaymentSuccessModal(true);
              setIsLoading(false);
              setSelected(null);
            } else {
              showToast("Payment verification failed", "error");
              setShowPaymentFailedModal(true);
              setIsLoading(false);
            }
          } catch (err) {
            console.error("VERIFY ERROR:", err);
            showToast("Something went wrong after payment", "error");
            setShowPaymentFailedModal(true);
            setIsLoading(false);
          } finally {
            setIsLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            showToast("Payment cancelled", "error");
            setShowPaymentFailedModal(true);
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
      {/* Payment Success Modal */}
      {showPaymentSuccessModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">

          <div className="bg-white rounded-[32px] p-7 max-w-md w-full text-center">

            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">

              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

              </div>

            </div>

            <h3 className="text-3xl font-semibold text-[#111111] mb-3">
              Payment Successful 🎉
            </h3>

            <p className="text-sm leading-7 text-black/60 mb-7">
              Your XVital package has been activated successfully.
              Receipt and package details have been sent to your email.
              You can Fetch your package with your email by clicking on the bag icon on the top right corner of the page.
            </p>

            <button
              onClick={() => {
                setShowPaymentSuccessModal(false);
              }}
              className="w-full bg-[#3E1747] hover:bg-[#52205f] transition-all text-white py-3 rounded-2xl font-medium"
            >
              Continue
            </button>

          </div>

        </div>
      )}

      {/* Payment Failed Modal */}
      {showPaymentFailedModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">

          <div className="bg-white rounded-[32px] p-7 max-w-md w-full text-center">

            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-6">

              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

              </div>

            </div>

            <h3 className="text-3xl font-semibold text-[#111111] mb-3">
              Payment Failed
            </h3>

            <p className="text-sm leading-7 text-black/60 mb-3">
              Your payment could not be completed.
              Please try again.
            </p>

            <div className="bg-[#FAF6FF] border border-[#E9D8FF] rounded-2xl p-4 mb-6">

              <p className="text-sm text-[#3E1747] leading-6">
                If any amount was deducted,
                it will be credited back to your account
                within <span className="font-semibold">
                  10–12 business days
                </span>.
              </p>

            </div>

            <button
              onClick={() => {
                setShowPaymentFailedModal(false);

                if (selected) {
                  handleBuy(selected);
                }
              }}
              className="w-full bg-[#3E1747] hover:bg-[#52205f] transition-all text-white py-3 rounded-2xl font-medium"
            >
              Try Again
            </button>

            <button
              onClick={() =>
                setShowPaymentFailedModal(false)
              }
              className="mt-4 text-sm text-black/50"
            >
              Cancel
            </button>

          </div>

        </div>
      )}
      {/* Purchase Check Modal */}
      {showPurchaseCheckModal && (
        <PurchaseCheckModal
          onClose={() => setShowPurchaseCheckModal(false)}
        />
      )}
    </section>
  );
}