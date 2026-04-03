"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  children: string;
  className?: string;
  tag?: React.ElementType;
  animateOnScroll?: boolean;
  delay?: number;
}

export default function SplitText({
  children,
  className = "",
  tag: Tag = "p",
  animateOnScroll = true,
  delay = 0,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Clear and split by character
    const text = children;
    el.innerHTML = "";
    
    // Create fragment for performance
    const fragment = document.createDocumentFragment();
    
    text.split("").forEach((char) => {
      const outerSpan = document.createElement("span");
      outerSpan.style.display = "inline-block";
      outerSpan.style.overflow = "hidden";
      outerSpan.style.verticalAlign = "top";
      
      const innerSpan = document.createElement("span");
      innerSpan.style.display = "inline-block";
      innerSpan.style.transform = "translateY(120%)";
      innerSpan.innerHTML = char === " " ? "&nbsp;" : char;
      
      outerSpan.appendChild(innerSpan);
      fragment.appendChild(outerSpan);
    });
    
    el.appendChild(fragment);

    const ctx = gsap.context(() => {
      const innerSpans = el.querySelectorAll<HTMLElement>("span > span");

      if (animateOnScroll) {
        gsap.to(innerSpans, {
          y: "0%",
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.02,
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
          },
        });
      } else {
        gsap.to(innerSpans, {
          y: "0%",
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.02,
          delay,
        });
      }
    });

    return () => ctx.revert();
  }, [children, animateOnScroll, delay]);

  return (
    <Tag 
      ref={containerRef} 
      className={`splitText ${className}`}
      aria-label={children}
    >
      {/* 
        The actual text is rendered dynamically in useEffect for split spans.
        We keep 'children' here as a fallback and for hydration consistency 
        but it will be replaced by the spans on client-side.
      */}
      {children}
    </Tag>
  );
}
