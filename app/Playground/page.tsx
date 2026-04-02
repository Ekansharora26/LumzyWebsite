"use client";

import { useEffect, useRef } from "react";
import SplitText from "@/src/component/SplitText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Playground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Array of 16 images (capped to prevent WebGL texture unit limit errors on integrated GPUs)
  const images = Array.from({ length: 16 }, (_, i) => {
    const num = i + 1;
    let ext = "png";
    if ([2, 3, 7, 8, 9, 10, 11, 15].includes(num)) ext = "jpg";
    return `/playground/playground${num}.${ext}`;
  });

  useEffect(() => {
    // Initialize the authentic WebGL image effect from the global Shery script
    const init = () => {
      // @ts-ignore
      if (typeof window !== "undefined" && window.Shery) {
        // @ts-ignore
        window.Shery.imageEffect(".playground_images", {
          style: 6,
          gooey: true,
          scrollType: 2,
          config: {
            gooey: { value: true },
            infiniteGooey: { value: true },
            durationOut: { value: 1, range: [0.1, 5] },
            durationIn: { value: 1.5, range: [0.1, 5] },
            displaceAmount: { value: 0.5 },
            masker: { value: true },
            gsap: { value: true },
            scrollType: { value: 0 },
            geoVertex: { range: [1, 64], value: 1 },
            noEffectGooey: { value: true },
            onMouse: { value: 0.2 },
            noise_speed: { value: 0.2, range: [0, 10] },
            metaball: { value: 0.2, range: [0, 2] },
            discard_threshold: { value: 0.5, range: [0, 1] },
            antialias_threshold: { value: 0.002, range: [0, 0.1] },
            noise_height: { value: 0.5, range: [0, 2] },
            noise_scale: { value: 10, range: [0, 100] },
          },
        });
      } else {
        // Retry if script hasn't loaded yet
        setTimeout(init, 100);
      }
    };

    init();

    // Pinning the main section for the scroll transition
    const pin = ScrollTrigger.create({
      trigger: "#main",
      start: "top top",
      end: "+=4000",
      pin: true,
      scrub: 1,
    });

    return () => {
      pin.kill();
    };
  }, []);

  return (
    <>
      <main id="main" className="playground_main" style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        <div className="playground_images" ref={containerRef} style={{ width: "100%", height: "100vh" }}>
          {images.map((src, i) => (
            <img key={i} src={src} alt={`Playground ${i + 1}`} style={{ display: i === 0 ? "block" : "none" }} />
          ))}
        </div>
        <div className="playgroundText" style={{ 
          position: "absolute", 
          left: "5vw", 
          top: "50%", 
          transform: "translateY(-50%)", 
          zIndex: 20,
          pointerEvents: "none",
          maxWidth: "30vw"
        }}>
          <div style={{ color: "#fff", lineHeight: "1.4" }}>
            <SplitText className="font12" tag="h1">
              A realm where ideas transcend conventional thinking, and the freedom to create is boundless, stretching into the infinite possibilities of imagination.
            </SplitText>
          </div>
          <div style={{ color: "#fff", opacity: 0.6 }} className="mT20">
            <SplitText className="font12" tag="h2">Let&apos;s Scroll</SplitText>
          </div>
        </div>
      </main>
    </>
  );
}