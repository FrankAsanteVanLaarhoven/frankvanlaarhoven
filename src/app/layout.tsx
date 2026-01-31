import type { Metadata, Viewport } from "next";
import { Inter, Syncopate } from "next/font/google";
import "./globals.scss";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syncopate = Syncopate({
  weight: ["400", "700"],
  variable: "--font-syncopate",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cognitive Divide | Frank van Laarhoven",
  description: "Bridging the gap between human creativity and digital logic. A Holographic Robotic Portfolio.",
  keywords: ["Robotics", "AI Safety", "Cognitive Divide", "Frank van Laarhoven", "VLA", "Agentic AI"],
  manifest: "/manifest.json",
  metadataBase: new URL("https://frankvanlaarhoven.com"),
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Cognitive Divide | Frank van Laarhoven",
    description: "Immersive Holographic Portfolio. Bridging human creativity and digital logic.",
    url: "https://frankvanlaarhoven.com",
    siteName: "Cognitive Divide",
    images: [
      {
        url: "/icon.png", // Use icon for OG
        width: 512,
        height: 512,
        alt: "Cognitive Divide Holographic Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cognitive Divide | Frank van Laarhoven",
    description: "Immersive Holographic Portfolio.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${syncopate.variable}`}>
        {children}
      </body>
    </html>
  );
}
