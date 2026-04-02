"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLHeadingElement>(null);
  const p2Ref = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const intro = introRef.current;
    const h1 = heading1Ref.current;
    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    const img = imgRef.current;

    if (!loader || !intro || !h1 || !p1 || !p2 || !img) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // Remove intro
        gsap.to(intro, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            intro.style.display = "none";
            document.body.classList.add("loaded");
            // Fade in hero
            const hero = document.querySelector(".hero") as HTMLElement;
            if (hero) {
              gsap.to(hero, { opacity: 1, duration: 1, ease: "power2.out" });
            }
          },
        });
      },
    });

    // Initial states
    gsap.set([h1, p1, p2], { y: "120%", opacity: 0 });
    gsap.set(img, { scale: 0, opacity: 0 });

    // Animate in
    tl.to(loader, { opacity: 0, duration: 0.4, delay: 0.3 })
      .to(h1, { y: "0%", opacity: 1, duration: 0.9, ease: "power4.out" }, 0.3)
      .to(p1, { y: "0%", opacity: 1, duration: 0.9, ease: "power4.out" }, 0.5)
      .to(p2, { y: "0%", opacity: 1, duration: 0.9, ease: "power4.out" }, 0.65)
      .to(img, { scale: 1, opacity: 1, duration: 1.2, ease: "power4.out" }, 0.4)
      // Hold
      .to({}, { duration: 1.4 })
      // Animate out: image scale up + text slides back
      .to(img, { scale: 1.1, opacity: 0, duration: 0.8, ease: "power2.in" })
      .to([h1, p1, p2], { y: "-120%", opacity: 0, duration: 0.6, ease: "power2.in", stagger: 0.05 }, "-=0.6");
  }, []);

  return (
    <>
      {/* Spinner Loader (initial flash) */}
      <div ref={loaderRef} className="loader">
        <div className="spinner"></div>
      </div>

      {/* Intro Animation */}
      <div ref={introRef} className="intro">
        <div className="intro_text">
          <div className="intro_text_heading">
            <h1 ref={heading1Ref}>Rebel Grace</h1>
          </div>
          <div className="intro_text_p">
            <h2 ref={p1Ref}>UIUX Designer &amp; Developer</h2>
          </div>
          <div className="intro_text_p mT20">
            <h2 ref={p2Ref}>Portfolio ©</h2>
          </div>
        </div>

        {/* Hero image scale-up on load */}
        <Image 
          ref={imgRef as any}
          src="/images/header_img_one.jpg" 
          alt="Rebel Grace" 
          width={500} 
          height={400} 
        />
      </div>
    </>
  );
}
