# unLabel — Remove AI Metadata from Images

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fuzaydev808%2FunLabel---Remove-Ai-Metadata)
[![Stack](https://img.shields.io/badge/Stack-Next.js%2016%20%C2%B7%20React%2019%20%C2%B7%20sharp-black)](https://github.com/uzaydev808/unLabel---Remove-Ai-Metadata)

**unLabel** is a privacy-first web utility to strip AI-generated metadata tags (EXIF, XMP, C2PA) from your photos. Social media platforms like Instagram and Facebook read these hidden signatures to automatically flag images as "Made with AI" or "AI-generated" — even after minor edits or Generative Fill. unLabel cleans your files instantly, direct in your browser, leaving no footprint on the server.

*Strip the label, keep the image.*

---

## ⚡ Features

- **Single-Click Metadata Stripping** — Drops EXIF, XMP, C2PA metadata from JPEGs, PNGs, and WebPs.
- **Zero-Storage Privacy** — Image files are processed in-memory via server route handlers and streamed back immediately. Nothing is stored on disk.
- **Neobrutalism UI** — A clean, distinctive, responsive dashboard designed for high readability and fast interaction.
- **SEO & Indexing Ready** — Built-in dynamic sitemaps and search crawler configuration.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.2.x (App Router, Turbopack)
- **Library:** React 19 (Server Components)
- **Styles:** Tailwind CSS v4
- **Engine:** `sharp` (Native Node.js image processing)
- **Validation:** Zod
- **Package Manager:** Bun

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Bun](https://bun.sh) installed.

### Development

1. Clone the repository:
   ```bash
   git clone https://github.com/uzaydev808/unLabel---Remove-Ai-Metadata.git
   cd unLabel---Remove-Ai-Metadata
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the local server:
   ```bash
   bun run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
bun run build
bun start
```

---

## 🔒 Privacy & Security

Files uploaded to unLabel are parsed entirely in memory as a Node.js Buffer, processed with `sharp`'s `.withMetadata(false)` functionality, and sent back as a download stream. No cloud storage (Vercel Blob, AWS S3, etc.) or local file systems are used. Your data stays yours.

---

## 📜 License

MIT License. Feel free to self-host and customize!
