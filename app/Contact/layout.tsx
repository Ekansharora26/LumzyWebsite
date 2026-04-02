import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Rebel Grace",
  description: "Get in touch with Rebel Grace for collaborations and creative work.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
