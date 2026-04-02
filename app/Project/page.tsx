"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "@/src/component/Footer";
import SplitText from "@/src/component/SplitText";

const allProjects = [
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
  {
    id: 4,
    title: "FinTech App",
    type: "Mobile App Design",
    img: "/images/header_img_one.jpg",
    href: "/Project",
  },
  {
    id: 5,
    title: "GreenEnergy",
    type: "Brand Identity",
    img: "/images/header_img_two.jpg",
    href: "/Project", // Using placeholder image since we only copied 3 main ones
  },
  {
    id: 6,
    title: "TechNova",
    type: "Web Development",
    img: "/images/about_header.jpg",
    href: "/Project",
  },
];

export default function Project() {
  return (
    <>
      <main id="main">
        {/* All Projects */}
        <section className="projects_all">
          <div className="container" id="projectsContainer">
            {allProjects.map((p) => (
              <Link key={p.id} href={p.href} className="case">
                <div className="projectCase">
                  <Image src={p.img} alt={p.title} fill style={{objectFit: 'cover'}} />
                </div>
                <div className="details">
                  <p className="font12">{p.title}</p>
                  <p className="font12">{p.type}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}