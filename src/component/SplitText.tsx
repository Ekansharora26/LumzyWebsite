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

    // Split text into words → each word wrapped in span>span
    const words = children.split(" ");
    el.innerHTML = words
      .map(
        (word) =>
          `<span style="display:inline-block;overflow:hidden;margin:0"><span style="display:inline-block;transform:translateY(120%)">${word}&nbsp;</span></span>`
      )
      .join("");

    const ctx = gsap.context(() => {
      const innerSpans = el.querySelectorAll<HTMLElement>("span > span");

      if (animateOnScroll) {
        gsap.to(innerSpans, {
          y: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.04,
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
          },
        });
      } else {
        gsap.to(innerSpans, {
          y: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.04,
          delay,
        });
      }
    });

    return () => ctx.revert();
  }, [children, animateOnScroll, delay]);

  return (
    <Tag ref={containerRef} className={`splitText ${className}`}>
      {children}
    </Tag>
  );
}
