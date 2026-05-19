"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useLoader } from "../context/LoaderContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Footer() {

  const { loading, setLoading } = useLoader();

  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = async (path) => {
    if (pathname === path) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 150));

    router.push(path);
  };

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <footer className="bg-[#0F0F12] py-16 border-t border-white/5">

      <div className="max-w-7xl mx-auto px-6">

        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* LEFT - BRAND */}
          <div className="max-w-sm">

            {/* Logo container */}
            <div className="inline-flex items-center bg-white px-3 py-2 rounded-lg">
              <Image
                src="/primaryLogo.png"
                alt="XVITAL logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>

            <p className="text-white/50 text-sm mt-4 leading-relaxed">
              Precision nutrition built for real lifestyles. No guesswork. No
              generic plans.
            </p>

          </div>

          {/* RIGHT */}
          <div className="flex flex-col sm:flex-row gap-10">

            {/* NAVIGATION */}
            <div>
              <h4 className="text-white text-sm font-medium mb-4">
                Navigation
              </h4>

              <div className="flex flex-col gap-2 text-sm text-white/60">

                <button
                  onClick={() => handleNavigation("/")}
                  className="hover:text-white transition flex justify-left cursor-pointer"
                >
                  Home
                </button>

                <button
                  onClick={() => handleNavigation("/diet")}
                  className="hover:text-white transition flex justify-left cursor-pointer"
                >
                  Diet
                </button>

                <button
                  onClick={() => handleNavigation("/products")}
                  className="hover:text-white transition flex justify-left cursor-pointer"
                >
                  Products
                </button>

              </div>
            </div>

            {/* Social Icons */}
            <div>
              <h4 className="text-white text-sm font-medium mb-4">
                Social
              </h4>

              <div className="flex gap-4">
                <a className="cursor-pointer text-white hover:text-white/80" href="https://www.facebook.com/xvitalnow/" target="_blank" rel="noopener noreferrer">
                  <Icon icon="mdi:facebook" width={24} />
                </a>

                <a className="cursor-pointer text-purple-600 hover:text-purple-500/80" href="https://www.instagram.com/xvitalnow/" target="_blank" rel="noopener noreferrer">
                  <Icon icon="mdi:instagram" width={24} />
                </a>

                <a className="cursor-pointer text-red-500 hover:text-red-400/80" href="https://www.youtube.com/@Xvitalnow/shorts" target="_blank" rel="noopener noreferrer">
                  <Icon icon="mdi:youtube" width={24} />
                </a>

                <a className="cursor-pointer text-blue-400 hover:text-blue-300/80" href="https://x.com/xvitalnow" target="_blank" rel="noopener noreferrer">
                  <Icon icon="mdi:twitter" width={24} />
                </a>

                <a className="cursor-pointer text-green-500 hover:text-green-400/80" href="https://wa.me/9118866992?text=Hi%20Xvitalnow,%20I%20want%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener noreferrer">
                  <Icon icon="mdi:whatsapp" width={24} />
                </a>

                <a className="cursor-pointer text-blue-600 hover:text-blue-500/80" href="https://www.linkedin.com/in/likith-kumar-658150361/" target="_blank" rel="noopener noreferrer">
                  <Icon icon="mdi:linkedin" width={24} />
                </a>
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h4 className="text-white text-sm font-medium mb-4">
                Contact
              </h4>

              <div className="flex flex-col gap-2 text-sm text-white/60">

                <a
                  href="mailto:connect@xvital.in"
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Icon icon="mdi:email-outline" width={16} />
                  connect@xvital.in
                </a>

              </div>
            </div>

          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} XVITAL. All rights reserved.
          </p>

          {/* Crafted by */}
          <Link
            href="https://webli.vercel.app"
            target="_blank"
            className="text-xs text-white/40 hover:text-white transition"
          >
            Crafted by Webli Studio
            <Icon icon="mdi:open-in-new" width={12} className="inline-block ml-1" />
          </Link>

        </div>

      </div>

    </footer>
  );
}