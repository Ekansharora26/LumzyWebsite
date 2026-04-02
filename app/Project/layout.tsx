import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Rebel Grace",
  description: "Explore the portfolio projects, UI/UX design, and development work of Rebel Grace.",
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
