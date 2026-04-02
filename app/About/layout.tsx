import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Rebel Grace",
  description: "Learn more about Rebel Grace, UIUX Designer & Developer. Enjoying the journey while changing the world.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
