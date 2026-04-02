import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        {/* Top */}
        <div className="top">
          <div className="left">
            <h4 className="font36">
              Let&apos;s build something great together.
            </h4>
            <p className="font12">
              Open to projects, collaborations, and creative work.
            </p>
          </div>
          <div className="right">
            <p className="font12">Get in touch</p>
            <a href="mailto:hello@rebelgrace.com" className="font12">
              hello@rebelgrace.com
            </a>
          </div>
        </div>

        {/* Center */}
        <div className="center">
          <div className="left">
            <p className="font12">Navigation</p>
            <Link href="/" className="font12">Home</Link>
            <Link href="/About" className="font12">About</Link>
            <Link href="/Project" className="font12">Projects</Link>
            <Link href="/Playground" className="font12">Playground</Link>
            <Link href="/Contact" className="font12">Contact</Link>
          </div>
          <div className="right">
            <p className="font12">Socials</p>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font12"
            >
              LinkedIn
            </a>
            <a
              href="https://www.behance.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="font12"
            >
              Behance
            </a>
            <a
              href="https://dribbble.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font12"
            >
              Dribbble
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font12"
            >
              Twitter
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="bottom">
          <p className="font12">
            <span>© {year}</span> Rebel Grace. All rights reserved.
          </p>
          <p className="font12">
            <span>Designed & Developed by</span> Rebel Grace
          </p>
        </div>
      </div>
    </footer>
  );
}
