"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FlipLink from "./FlipLink";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (menuOpen) {
      overlay.classList.add("active");
    } else {
      overlay.classList.remove("active");
    }
  }, [menuOpen]);

  return (
    <>
      {/* Overlay for closing mobile menu */}
      <div ref={overlayRef} className="overlay" onClick={closeMenu}></div>

      {/* Sliding Mobile Navigation */}
      <div className={`sliding_navigation ${menuOpen ? "active" : ""}`}>
        <Link href="/" className="font36" onClick={closeMenu}>Home</Link>
        <Link href="/About" className="font36" onClick={closeMenu}>About</Link>
        <Link href="/Project" className="font36" onClick={closeMenu}>Projects</Link>
        <Link href="/Playground" className="font36" onClick={closeMenu}>Playground</Link>
        <Link href="/Contact" className="font36" onClick={closeMenu}>Contact</Link>
      </div>

      {/* Main Navbar */}
      <nav>
        {/* Nav Blur Effect */}
        <div className="navBlur">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="container">
          {/* Logo */}
          <Link href="/" className="font12" style={{ fontFamily: "MMMedium, monospace" }}>
            Rebel.Grace
          </Link>

          {/* Desktop Links */}
          <div className="nav_links">
            <FlipLink href="/">Home</FlipLink>
            <FlipLink href="/About">About</FlipLink>
            <FlipLink href="/Project">Projects</FlipLink>
            <FlipLink href="/Playground">Playground</FlipLink>
            <FlipLink href="/Contact">Contact</FlipLink>
          </div>

          {/* Hamburger */}
          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            style={{ cursor: "pointer" }}
          >
            <div></div>
            <div></div>
          </div>
        </div>
      </nav>
    </>
  );
}
