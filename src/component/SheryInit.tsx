"use client";

import { useEffect } from "react";

export default function SheryInit() {
  useEffect(() => {
    // Shery exists globally from the CDN script in layout.tsx
    const Shery = (window as any).Shery;

    if (Shery) {
      try {
        // Initialize Liquid Mouse Follower
        Shery.mouseFollower({
          skew: true,
          debug: false,
          setCursor: true,
        });

        // Initialize Magnetic Effects
        // Targets: Nav links, logo, social links, and buttons
        Shery.makeMagnet(".nav_links a, nav .container > a, .flip__link, footer a, .hamburger", {
          ease: "cubic-bezier(0.23, 1, 0.320, 1)",
          duration: 1,
        });

        console.log("Shery.js interactions initialized");
      } catch (err) {
        console.warn("Shery.js initialization failed:", err);
      }
    }
  }, []);

  return null;
}
