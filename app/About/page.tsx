"use client";

import Footer from "@/src/component/Footer";
import SplitText from "@/src/component/SplitText";
import Image from "next/image";

const careerBlocks = [
  {
    heading: "Experience",
    items: [
      {
        text: "Senior UI/UX Designer — Studio 4",
        subtext: "2021 - Present",
      },
      {
        text: "Product Designer — ScaleUp Inc",
        subtext: "2018 - 2021",
      },
      {
        text: "UX Researcher — Creative Agency",
        subtext: "2016 - 2018",
      },
      {
        text: "Junior Web Designer — Startup Hub",
        subtext: "2015 - 2016",
      },
    ],
  },
  {
    heading: "Education",
    items: [
      {
        text: "Master of Fine Arts (MFA) in Interaction Design",
        subtext: "School of Visual Arts (SVA)",
      },
      {
        text: "Bachelor of Science in Graphic Design",
        subtext: "Rhode Island School of Design (RISD)",
      },
      {
        text: "UX Design Certification",
        subtext: "Nielsen Norman Group (NN/g)",
      },
    ],
  },
  {
    heading: "Awards & Recognitions",
    items: [
      {
        text: "Awwwards Site of the Day",
        subtext: "2023",
      },
      {
        text: "Red Dot Design Award",
        subtext: "2022",
      },
      {
        text: "CSS Design Awards",
        subtext: "Best UI Design - 2021",
      },
      {
        text: "Webby Awards Honoree",
        subtext: "2020",
      },
    ],
  },
];

export default function About() {
  return (
    <>
      <main id="main">
        {/* ── Header ─────────────────────────────────────────── */}
        <section className="about_header">
          <div className="container">
            <div className="about_heading">
              <SplitText className="font52" tag="h1">
                ENJOYING THE JOURNEY WHILE CHANGING THE WORLD
              </SplitText>
              {/* Note: In a real app we might load LordIcon via a Script tag or an npm wrapper */}
              <div style={{ width: "50px", height: "50px" }}>
                 <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="27" cy="27" r="26" stroke="white" strokeWidth="2"/>
                    <path d="M27 15V39M15 27H39" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="about_header_img mT50">
            <Image src="/images/about_header.jpg" alt="About Header" fill style={{objectFit: 'cover'}} />
          </div>
        </section>

        {/* ── Text ─────────────────────────────────────────── */}
        <section className="about_txt">
          <div className="container">
            <SplitText className="font12" tag="p">
              I am Rebel Grace, a passionate designer, dedicated manager, and keen observer of the digital landscape. With a specialization in creating immersive web experiences, I seamlessly integrate sophisticated aesthetics, dynamic and interactive animations, and user-friendly interfaces to elevate every project to its highest potential, ensuring both beauty and functionality harmonize in perfect synergy.
            </SplitText>
            <SplitText className="font12 mT20" tag="p">
              My approach is deeply rooted in a commitment to innovation and attention to detail, ensuring that every project I undertake not only meets but exceeds expectations. I believe in the power of design to tell stories, evoke emotions, and create memorable experiences that resonate with users. By combining my expertise in visual design, project management, and user experience, I strive to craft digital solutions that are not just visually stunning but also deeply engaging and intuitive. My goal is to transform ideas into impactful realities, delivering results that leave a lasting impression.
            </SplitText>
          </div>
        </section>

        {/* ── Details / Career ─────────────────────────────────────────── */}
        <section className="about_career">
          <div className="container">
            <SplitText className="font52" tag="h2">Career, Expertise, Achievements</SplitText>

            <div id="careerBlocks" className="mT70">
              {careerBlocks.map((block, i) => (
                <div key={i} className="block mT50">
                  <div className="heading">
                    <SplitText className="font36" tag="h3">{block.heading}</SplitText>
                  </div>
                  <div className="wrapper mT20">
                    {block.items.map((item, j) => (
                      <div key={j} className="row">
                        <p className="font12">{item.text}</p>
                        <p className="font12">{item.subtext}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}