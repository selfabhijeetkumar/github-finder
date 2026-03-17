import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "GitHub Universe Explorer | 3D Profile Finder",
  description: "An extraordinary GitHub Profile Finder with immersive 3D visualizations, smooth animations, and comprehensive data analytics.",
  keywords: ["GitHub", "Profile Finder", "Developer", "3D Visualization", "Open Source"],
  openGraph: {
    title: "GitHub Universe Explorer",
    description: "Transform GitHub profiles into an immersive 3D experience",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <QueryProvider>
            <Navbar />
            <main>{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
