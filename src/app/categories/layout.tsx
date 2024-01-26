import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "All Categories",
  description: "List of all categories",
};

export const revalidate = 0;

export default function CategoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`${inter.className} select-none flex flex-col flex-1`}>
      {children}
    </main>
  );
}
