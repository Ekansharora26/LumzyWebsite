import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground | Rebel Grace",
  description: "A realm where ideas transcend conventional thinking. Explore creative limits.",
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
