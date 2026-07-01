# unLabel — Product Requirements Document (PRD)

> **Version:** 1.2  
> **Status:** Draft  
> **Stack:** Next.js 16.2.x · React 19 · sharp · Vercel / Railway  

---

## 1. Overview

**unLabel** is a web tool for stripping AI metadata from images — including EXIF, XMP, C2PA, and other signatures that platforms like Instagram and Facebook use to flag an image as "Made with AI" or "AI-generated".

**Tagline:** *Strip the label, keep the image.*

**Target users:**
- Content creators whose photos get flagged as AI even after minor edits
- Developers and designers who need a self-hostable metadata stripping tool
- SaaS builders who want to embed this feature into their own products

---

## 2. Problem Statement

Social media platforms like Instagram and Facebook detect AI-generated images based on metadata (C2PA, XMP, EXIF). Even minimal use of tools like Photoshop Generative Fill is enough to trigger the "Made with AI" label — which is often misleading. Currently there is no open-source Next.js-based tool that can be self-hosted and deployed to Vercel or Railway for this purpose.

---

## 3. Goals & Non-Goals

### Goals

- Strip image metadata (JPEG, PNG, WebP) via a Next.js 16 route handler
- Deploy-ready on both Vercel and Railway with minimal configuration
- Simple, responsive upload UI
- Batch processing (minimum 10 files at once) in MVP+

### Non-Goals (for now)

- Visual watermark removal (inpainting) — scoped to v2+
- Native mobile app (iOS/Android)
- In-app image editor
- User accounts / auth system in MVP

---

## 4. User Stories

| ID | User Story | Priority |
|----|------------|----------|
| US-01 | As a content creator, I want to upload an image and download a clean version without AI metadata | P0 |
| US-02 | As a developer, I want to batch upload multiple files and download all results at once | P1 |
| US-03 | As a user, I want to see a before/after preview of the processed image | P1 |
| US-04 | As a user, I want to know which metadata fields were removed | P2 |
| US-05 | As a developer, I want to call the API endpoint directly without using the UI | P2 |

---

## 5. Feature Scope

### MVP (v1.0)

- **Single file upload** — JPEG, PNG, WebP, max 10MB
- **Metadata stripping** via `sharp` (`.withMetadata(false)`)
- **Before/after preview** — file size comparison, filename display
- **Download result** — directly to browser, nothing stored on server
- **Responsive UI** — desktop and mobile

### v1.1 — Batch Mode

- Multi-file drag and drop (max 20 files)
- Per-file progress indicator
- ZIP download for all results

### v1.2 — Metadata Audit

- Show detected metadata list before processing
- Show confirmation of removed metadata fields after processing
- Deep clean support via `exiftool` as a sidecar process (Railway only)

### v2.0 — API Access

- Open `POST /api/clean` endpoint, optionally secured with API key
- Response: file blob or temporary Vercel Blob URL
- Rate limiting via Upstash Redis

---

## 6. Technical Architecture

### Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | **Next.js 16.2.x** (App Router) | Latest stable as of June 2026; PPR GA, React Compiler stable |
| Runtime | **Node.js 20.9+** | Minimum requirement for Next.js 16 (Node 18 dropped) |
| Language | TypeScript | Typed config and typed route handlers |
| React | **React 19** | Bundled with Next.js 16; stable Server Actions |
| Image processing | `sharp` | Native Node.js, built-in metadata stripping via `.withMetadata(false)` |
| Upload parsing | **Native `request.formData()`** | No need for `busboy` or `formidable` in Next.js 16 |
| Temporary storage | In-memory / Vercel Blob | No persistence; results returned directly as blob |
| Deploy target | **Vercel** or **Railway** | Both support Node runtime |
| Styling | Tailwind CSS v4 | Utility-first, fast prototyping |
| Bundler | **Turbopack** (default) | Default in Next.js 16; 2–5× faster than Webpack |

### Next.js 16 Breaking Changes Relevant to This Project

- **Async request APIs are mandatory** — `params`, `searchParams`, `cookies()`, `headers()` are all async and must be `await`ed
- **`middleware.ts` deprecated** → replaced by `proxy.ts` for network boundary logic
- **Custom webpack config is ignored** — Turbopack is now the default; custom loaders (e.g. SVG) must be migrated to Turbopack configuration
- **`revalidateTag()` requires a second argument** — `revalidateTag("key", "max")`
- **React Compiler active by default** — reduces the need for manual `useMemo` / `useCallback`
- **`cacheComponents: true`** available in `next.config.ts` for granular per-component caching

### Folder Structure

```
unlabel/
├── app/
│   ├── layout.tsx                # Root layout, fonts, metadata
│   ├── page.tsx                  # Main upload UI
│   ├── api/
│   │   └── clean/
│   │       └── route.ts          # POST handler, sharp processing
│   └── components/
│       ├── Uploader.tsx          # Drag-drop + file input (client component)
│       ├── PreviewCard.tsx       # Before/after preview
│       └── ProgressBar.tsx       # Batch progress (v1.1)
├── lib/
│   └── cleanImage.ts             # Sharp logic, reusable, server-only
├── next.config.ts
├── proxy.ts                      # Replaces middleware.ts in Next.js 16
└── package.json
```

### Request Flow

```
User uploads image
      │
      ▼
POST /api/clean  (multipart/form-data)
      │
      ▼
const formData = await request.formData()   ← native Next.js 16
const file = formData.get('file') as File
const buffer = Buffer.from(await file.arrayBuffer())
      │
      ▼
sharp(buffer).withMetadata(false).toBuffer()
      │
      ▼
Response blob (Content-Type: image/png)
      │
      ▼
Frontend triggers download
```

---

## 7. API Design

### `POST /api/clean`

**Request:**
```
Content-Type: multipart/form-data
Body: { file: File }
```

**Success response (200):**
```
Content-Type: image/png
Content-Disposition: attachment; filename="cleaned-{original}.png"
Body: <image buffer>
```

**Error response:**
```json
{ "error": "Invalid file or size exceeds limit." }
```

**Constraints:**
- Max file size: 10MB (MVP), 20MB (v1.1)
- Accepted formats: `image/jpeg`, `image/png`, `image/webp`
- Input validation must use **Zod** — all user-provided data must be validated before processing (Next.js 16 security principle)

---

## 8. Critical Configuration

### `next.config.ts`

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['sharp'],
  cacheComponents: true,          // opt-in per-component caching (Next.js 16)
};

export default nextConfig;
```

### Route Handler Example (Next.js 16)

```ts
// app/api/clean/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();           // async, native Next.js 16
  const file = formData.get('file') as File | null;

  if (!file) return Response.json({ error: 'No file' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const cleaned = await cleanImage(buffer);            // lib/cleanImage.ts

  return new Response(cleaned, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="cleaned.png"`,
    },
  });
}
```

### Vercel vs Railway

| Constraint | Vercel Hobby | Vercel Pro | Railway |
|------------|-------------|------------|---------|
| API timeout | 10 seconds | 60 seconds | No default limit |
| Max payload | 4.5MB | 4.5MB | Configurable |
| Node.js 20.9+ | ✅ | ✅ | ✅ |
| Best for | Single file MVP | Small batches | Large batches + exiftool sidecar |

> **Recommendation:** Start on Vercel Hobby for MVP. Migrate to Railway when batch processing or sidecar processes are needed.

---

## 9. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Response time for single file (<5MB) | < 3 seconds |
| UI load time | < 1.5 seconds (LCP) |
| Mobile support | Minimum 375px viewport |
| No server-side file storage | Mandatory — privacy-first |
| Error handling | All states covered: loading, error, success |
| Input validation | Zod on all route handlers |

---

## 10. Known Limitations to Communicate to Users

- This tool works for **metadata-based detection**. If a platform detects AI through visual content analysis (not metadata), removing metadata may not remove the label.
- RAW or HEIC format images must be converted to JPEG/PNG before uploading.
- A platform label may persist if the platform relies on internal edit history that is not stored in the file itself.

---

## 11. Roadmap

```
MVP (v1.0)    ─── Single file, metadata strip, download
    │
v1.1          ─── Batch mode, ZIP download, per-file progress
    │
v1.2          ─── Metadata audit (show before/after diff)
    │
v2.0          ─── Open API endpoint, rate limiting, API key auth
    │
v2.1          ─── Visual watermark inpainting (SD / lama-cleaner)
```

---

## 12. Success Metrics

| Metric | MVP Target |
|--------|-----------|
| Files successfully processed without error | > 95% |
| Users can download result without confusion | Validated by zero error reports |
| "Made with AI" label removed after re-upload | Manually verified on major platforms |

