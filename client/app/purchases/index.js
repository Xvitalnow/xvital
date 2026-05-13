"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function Purchase() {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedOrders =
      JSON.parse(localStorage.getItem("userOrders")) || [];

    const storedEmail =
      localStorage.getItem("userEmail") || "";

    setOrders(storedOrders);
    setEmail(storedEmail);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFB] px-6 py-10">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-10">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-[#3E1747]/10 flex items-center justify-center shrink-0">
            <Icon
              icon="solar:bag-4-bold"
              className="text-[#3E1747]"
              width="28"
            />
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-[#111]">
              My Purchases
            </h1>

            <p className="text-sm text-[#3E1747]/60 mt-1 break-all">
              {email}
            </p>
          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto">

        {orders.length === 0 ? (

          <div className="bg-white rounded-[30px] border border-black/5 py-20 px-6 text-center">

            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Icon
                icon="solar:bag-cross-bold"
                className="text-red-400"
                width="30"
              />
            </div>

            <h3 className="text-lg font-semibold text-[#111]">
              No Purchases Yet
            </h3>

            <p className="text-sm text-black/50 mt-2">
              Your purchased plans will appear here.
            </p>

          </div>

        ) : (

          <div className="grid gap-5">

            {orders.map((order, index) => {
              const isActive =
                new Date(order.expiryDate) > new Date();

              const remainingDays = order.expiryDate
                ? Math.max(
                    0,
                    Math.ceil(
                      (new Date(order.expiryDate) -
                        new Date()) /
                        (1000 * 60 * 60 * 24)
                    )
                  )
                : 0;

              return (
                <div
                  key={index}
                  className="bg-white rounded-[30px] border border-black/5 p-6 transition-all duration-300 hover:shadow-md"
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between gap-4">

                    {/* LEFT */}
                    <div className="flex items-start gap-4">

                      {/* ICON */}
                      <div className="w-14 h-14 rounded-2xl bg-[#3E1747]/10 flex items-center justify-center shrink-0">
                        <Icon
                          icon="solar:box-bold"
                          className="text-[#3E1747]"
                          width="28"
                        />
                      </div>

                      {/* INFO */}
                      <div>

                        {/* PACKAGE */}
                        <h2 className="text-lg font-semibold text-[#111] leading-tight">
                          {order.packageName}
                        </h2>

                        {/* PRICE */}
                        <div className="flex items-center gap-2 mt-4 text-black/60">
                          <Icon
                            icon="solar:wallet-money-bold"
                            width="16"
                          />

                          <p className="text-sm">
                            ₹{order.amount}
                          </p>
                        </div>

                        {/* EXPIRY */}
                        <div className="flex items-center gap-2 mt-2 text-black/40">
                          <Icon
                            icon="solar:calendar-bold"
                            width="16"
                          />

                          <p className="text-xs">
                            Expires on:{" "}
                            {order.expiryDate
                              ? new Date(
                                  order.expiryDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>

                        {/* DAYS LEFT */}
                        {order.expiryDate && (
                          <div className="flex items-center gap-2 mt-2 text-[#3E1747]/60">
                            <Icon
                              icon="solar:clock-circle-bold"
                              width="16"
                            />

                            <p className="text-xs">
                              {remainingDays} days remaining
                            </p>
                          </div>
                        )}

                      </div>

                    </div>

                    {/* STATUS */}
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                        isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {isActive ? "Active" : "Expired"}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>
    </div>
  );
}