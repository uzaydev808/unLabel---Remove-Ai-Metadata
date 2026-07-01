import { z } from "zod";
import { cleanImage } from "../../../lib/cleanImage";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const cleanedFilename = (original: string): string => {
  const dotIndex = original.lastIndexOf(".");
  if (dotIndex < 1) return `cleaned-${original}`;
  const stem = original.slice(0, dotIndex);
  const ext = original.slice(dotIndex);
  return `cleaned-${stem}${ext}`;
};

// Simple manual enum validation to bypass zod v4 enum type-check issues if any
const fileSchema = z.object({
  name: z.string().min(1),
  type: z.string().refine((val): val is (typeof ALLOWED_MIME_TYPES)[number] =>
    ALLOWED_MIME_TYPES.includes(val as (typeof ALLOWED_MIME_TYPES)[number]),
  {
    message: "Unsupported file type. Use JPEG, PNG, or WebP.",
  }),
  size: z.number().int().positive().max(MAX_FILE_SIZE, {
    message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
  }),
});

export async function POST(request: Request): Promise<Response> {
  let file: File | null = null;
  try {
    const formData = await request.formData();
    const raw = formData.get("file");
    if (raw instanceof File) file = raw;
  } catch {
    // formData() throws when the request body is empty or not multipart.
  }

  if (!file) {
    return Response.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const parsed = fileSchema.safeParse({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid file.";
      return Response.json({ error: firstError }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const cleaned = await cleanImage(buffer);

    const filename = cleanedFilename(file.name);
    const contentType = file.type;

    return new Response(new Uint8Array(cleaned), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return Response.json(
      { error: "Failed to process image. The file may be corrupted or in an unsupported format." },
      { status: 500 },
    );
  }
}
