import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Codemonks',
  description: 'Online Coding Platform',
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{backgroundColor: "#0e0e0e"}}>
      <head>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6624136238256035"
     crossOrigin="anonymous"></script>
      </head>
      <body className={`${inter.className} min-h-[81vh] bg-[#0e0e0e]`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="w-full h-full">
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}