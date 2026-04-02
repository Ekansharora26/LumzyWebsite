"use client";

import Link from "next/link";
import React from "react";

interface FlipLinkProps {
  href: string;
  children: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function FlipLink({ href, children, className = "flip__link", style }: FlipLinkProps) {
  // Split the word into individual characters wrapped in `<span class="char">`
  // with a CSS variable `--char-index` so the CSS transition-delay works.
  const chars = children.split("").map((c, i) => (
    <span
      key={i}
      className="char"
      style={{ "--char-index": i } as React.CSSProperties}
    >
      {c === " " ? "\u00A0" : c}
    </span>
  ));

  const LinkComponent = href.startsWith("http") || href.startsWith("mailto") ? "a" : Link;

  return (
    <LinkComponent href={href} className={className} style={style}>
      <span className="flip__link--text">{chars}</span>
      <span className="flip__link--text">{chars}</span>
    </LinkComponent>
  );
}
