import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to CodeMonks",
  description: "CodeMonks is an online judge web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full">
      <Navbar />
      <div className="w-full h-full">
        <div className="w-full h-full mt-[74px]">
          {children}
        </div>
      </div>
    </div>
  );
}