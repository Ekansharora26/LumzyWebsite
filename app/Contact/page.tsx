"use client";

import Footer from "@/src/component/Footer";
import SplitText from "@/src/component/SplitText";
import FlipLink from "@/src/component/FlipLink";

export default function Contact() {
  return (
    <>
      <main id="main">
        {/* ── Header ─────────────────────────────────────────── */}
        <section className="contact_header">
          <div className="container">
            <div className="top">
              <SplitText className="font52" tag="h1">
                Let&apos;s Join to Create an Impact Together.
              </SplitText>
               <div style={{ width: "50px", height: "50px" }}>
                 <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="27" cy="27" r="26" stroke="white" strokeWidth="2"/>
                    <path d="M27 15V39M15 27H39" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div className="text mT70">
              <SplitText className="font12" tag="p">
                I&apos;m open to new opportunities and collaborations! Whether you want to discuss a project, schedule a 1:1 portfolio review, or simply connect—don&apos;t hesitate to reach out. Feel free to say hello, hallo, or olá, and let&apos;s start a conversation!
              </SplitText>
            </div>
          </div>
        </section>

        {/* ── Mail ─────────────────────────────────────────── */}
        <section className="mail mT70">
          <FlipLink href="mailto:hello@rebelgrace.com" style={{fontSize: '5vw', letterSpacing: '-0.5vw', fontFamily: 'Smedium, sans-serif'}}>
             hello@rebelgrace.com
          </FlipLink>
        </section>
      </main>

      <Footer />
    </>
  );
}