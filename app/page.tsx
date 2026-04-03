"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/src/component/Footer";
import SplitText from "@/src/component/SplitText";
import FlipLink from "@/src/component/FlipLink";
import InfoGrid from "@/src/component/InfoGrid";

// ─── Data ────────────────────────────────────────────────────────────────────

const featuredProjects = [
  {
    id: 1,
    title: "HealthTrack",
    type: "UI/UX Design",
    img: "/images/header_img_one.jpg",
    href: "/Project",
  },
  {
    id: 2,
    title: "ChainFlow",
    type: "Product Design",
    img: "/images/header_img_two.jpg",
    href: "/Project",
  },
  {
    id: 3,
    title: "EduSpace",
    type: "Web Design",
    img: "/images/about_header.jpg",
    href: "/Project",
  },
];

const services = [
  {
    title: "UI/UX Design",
    tags: ["Research", "Wireframing", "Prototyping", "User Testing", "Figma"],
    desc: "End-to-end product design from discovery through delivery — grounded in user research and refined through iteration.",
  },
  {
    title: "Visual Identity",
    tags: ["Brand Strategy", "Logo Design", "Typography", "Color Systems"],
    desc: "Crafting cohesive brand identities that communicate clearly and leave a lasting impression across every touchpoint.",
  },
  {
    title: "Motion Design",
    tags: ["After Effects", "Lottie", "Micro-interactions", "Prototyping"],
    desc: "Bringing interfaces to life with purposeful motion — from subtle micro-interactions to full product animations.",
  },
  {
    title: "Web Development",
    tags: ["Next.js", "React", "TypeScript", "CSS", "Performance"],
    desc: "Building fast, accessible, pixel-perfect web experiences that match the design vision with precision.",
  },
];

const whatWeDo = [
  {
    num: "01",
    title: "Discover",
    desc: "Deep-diving into your business goals, user needs, and competitive landscape to form a solid strategic foundation.",
    img: "/images/header_img_one.jpg",
  },
  {
    num: "02",
    title: "Design",
    desc: "Translating strategy into beautiful, user-centric interfaces — from wireframes to high-fidelity prototypes.",
    img: "/images/header_img_two.jpg",
  },
  {
    num: "03",
    title: "Develop",
    desc: "Shipping clean, maintainable code that brings designs to life with precision, performance, and accessibility.",
    img: "/images/about_header.jpg",
  },
];

const expertise = [
  "HealthTech", "Supply Chain", "Research and Development", "Wellness",
  "Blockchain and NFTs", "EdTech", "Data Insights", "Entertainment",
  "Finance", "Real Estate", "Travel & Hospitality", "Retail Tech",
  "Automotive", "Real Estate Tech", "Nonprofit", "Legal Tech",
  "Energy & Utilities", "Government", "Media & Publishing", "Telecommunications",
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleAccordion = (i: number) => {
    setOpenAccordion((prev) => (prev === i ? null : i));
  };

  useEffect(() => {
    // Accordion Logic
    answerRefs.current.forEach((el, i) => {
      if (!el) return;
      if (openAccordion === i) {
        el.style.height = el.scrollHeight + "px";
        el.style.opacity = "1";
      } else {
        el.style.height = "0";
        el.style.opacity = "0";
      }
    });

    // Initialize Shery Image Effects
    const Shery = (window as any).Shery;
    if (Shery) {
      try {
        Shery.imageEffect(".image-effect", {
          style: 3, // Liquid Wave Effect
          config: {
            distort: { value: true },
            masker: { value: true },
            gooey: { value: true },
            infiniteGooey: { value: true },
            duration: { value: 1, range: [0, 10] },
          },
        });
      } catch (err) {
        console.warn("Shery ImageEffect failed:", err);
      }
    }
  }, [openAccordion]);

  return (
    <>
      <main id="main">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero_main">
            <div className="heroimage image-effect">
              <Image src="/images/header_img_one.jpg" alt="Rebel Grace" fill style={{objectFit: 'cover'}} />
            </div>
            <h1 className="fontVW">Rebel.Grace</h1>
          </div>

          <InfoGrid />

        </section>

        {/* ── About ─────────────────────────────────────────── */}
        <section className="about">
          <div className="container">
            <div className="txt">
              <SplitText className="font12" tag="h2">
                Elevating businesses through crafting exceptional digital experiences, driving innovation, delivering impeccable design solutions, and enhancing success with expertise. My goal is to exceed expectations and set new standards in creative excellence.
              </SplitText>
              <SplitText className="font12 mT50" tag="h2">
                At the core of my approach is a commitment to understanding each client&apos;s unique vision and translating it into a compelling digital presence. I specialize in creating user-centric designs that not only captivate audiences but also drive engagement and conversions.
              </SplitText>
            </div>
            <div className="about_numbers mT50">
              <div className="block">
                <h3 className="fontNumber">+22</h3>
                <p className="font12">Total Projects</p>
              </div>
              <div className="block">
                <h3 className="fontNumber">+8</h3>
                <p className="font12">Years of Experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Projects ──────────────────────────────── */}
        <section className="featured_projects">
          <div className="container">
            <div className="heading">
              <SplitText className="font52" tag="h2">
                Featured Projects
              </SplitText>
              <FlipLink href="/Project">View&nbsp;All&nbsp;Projects</FlipLink>
            </div>

            <div className="featured_projects_wrapper mT70">
              {/* Row 1 */}
              <div className="row1">
                {featuredProjects.slice(0, 2).map((p) => (
                  <Link key={p.id} href={p.href} className="case">
                    <div className="projectCase image-effect">
                      <Image src={p.img} alt={p.title} fill style={{objectFit: 'cover'}} />
                    </div>
                    <div className="details">
                      <p className="font12">{p.title}</p>
                      <p className="font12">{p.type}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {/* Row 2 */}
              <div className="row2">
                <Link href={featuredProjects[2].href} className="case">
                  <div className="projectCase image-effect">
                    <Image src={featuredProjects[2].img} alt={featuredProjects[2].title} fill style={{objectFit: 'cover'}} />
                  </div>
                  <div className="details">
                    <p className="font12">{featuredProjects[2].title}</p>
                    <p className="font12">{featuredProjects[2].type}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Services ──────────────────────────────────────── */}
        <section className="services">
          <div className="container">
            <div className="heading">
              <SplitText className="font52" tag="h2">Services</SplitText>
            </div>
            <div className="wrapper mT70">
              <div className="txt">
                <SplitText className="font12" tag="p">
                  From initial concept to final product delivery, my mission is to help businesses create exceptional experiences through top-tier design. While my primary expertise lies in UI/UX Design, my work encompasses a broad skill set, including visual identity and motion design.
                </SplitText>
              </div>
              <div className="accordians_wrapper">
                {services.map((s, i) => (
                  <div
                    key={i}
                    className="accordion"
                    onClick={() => toggleAccordion(i)}
                  >
                    <div className="question">
                      <p className="font12">{s.title}</p>
                      <div className={`close ${openAccordion === i ? "rotate" : ""}`}>
                        {/* Plus / X icon */}
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <line x1="14" y1="0" x2="14" y2="28" stroke="#ffffffe5" strokeWidth="1.5" />
                          <line x1="0" y1="14" x2="28" y2="14" stroke="#ffffffe5" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                    <div
                      className="answer"
                      ref={(el) => { answerRefs.current[i] = el; }}
                    >
                      <p className="font12" style={{ marginTop: "12px", marginBottom: "12px" }}>
                        {s.desc}
                      </p>
                      <div className="tags">
                        {s.tags.map((t) => (
                          <p key={t} className="font12">{t}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── What We Do ────────────────────────────────────── */}
        <section className="what_we_do">
          <div className="container">
            <div className="heading">
              <SplitText className="font52" tag="h2">Discover, Design, Develop</SplitText>
            </div>
            <div className="wrapper">
              {whatWeDo.map((item) => (
                <div className="row" key={item.num}>
                  <div className="title">
                    <h5 className="font12">{item.num}</h5>
                    <p className="font12">{item.title}</p>
                    <p className="font12" style={{ color: "#737373", marginTop: "6px" }}>
                      {item.desc}
                    </p>
                  </div>
                  <div className="img image-effect">
                    <Image src={item.img} alt={item.title} fill style={{objectFit: 'cover'}} className="clipImageReveal" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fields of Expertise ───────────────────────────── */}
        <section className="areasWork">
          <div className="container">
            <div className="heading">
              <SplitText className="font52" tag="h2">Fields of Expertise</SplitText>
            </div>
            <div className="wrapper mT70">
              <div className="categories">
                  {expertise.map((item) => (
                  <p key={item} className="font12">{item}</p>
                ))}
              </div>
              <div className="areasImage image-effect">
                <Image className="mainImage" src="/images/about_header.jpg" alt="Fields of Expertise" fill style={{objectFit: 'cover'}} />
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
