import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://unlabel.devkit.my.id";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s · unLabel",
    default: "unLabel — Remove AI Metadata from Images",
  },
  description:
    "Upload an image and strip AI-generated metadata (EXIF, XMP, C2PA). Social-media-ready downloads. No server storage, private by design.",
  keywords: [
    "remove AI metadata",
    "strip EXIF",
    "strip XMP",
    "remove C2PA",
    "AI image label remover",
    "social media image metadata",
    "Instagram AI tag removal",
    "Facebook AI metadata",
    "privacy image tool",
  ],
  authors: [{ name: "unLabel" }],
  creator: "unLabel",
  publisher: "unLabel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/favicon_io/site.webmanifest",
  icons: {
    icon: "/favicon_io/favicon.ico",
    shortcut: "/favicon_io/favicon-16x16.png",
    apple: "/favicon_io/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon_io/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/favicon_io/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/favicon_io/android-chrome-512x512.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "unLabel",
    title: "unLabel — Remove AI Metadata from Images",
    description:
      "Upload an image and strip AI-generated metadata (EXIF, XMP, C2PA). Social-media-ready downloads. No server storage, private by design.",
    url: siteUrl,
    locale: "en_US",
    images: [
      {
        url: "/favicon_io/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "unLabel logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "unLabel — Remove AI Metadata from Images",
    description:
      "Upload an image and strip AI-generated metadata (EXIF, XMP, C2PA). Social-media-ready downloads. No server storage, private by design.",
    images: ["/favicon_io/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#f0cede",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmMono.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}